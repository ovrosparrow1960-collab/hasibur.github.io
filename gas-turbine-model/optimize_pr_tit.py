# -*- coding: utf-8 -*-
"""
=============================================================================
MULTI-OBJECTIVE OPTIMIZATION OF THE GAS TURBINE CYCLE  (pymoo + TESPy)
=============================================================================
Design variables (what the optimizer may change):
    x1 = compressor pressure ratio  pr   in [8 ... 24]
    x2 = turbine inlet temperature  TIT  in [950 ... 1350] degC

Objectives (both maximized -> classic Brayton-cycle trade-off):
    f1 = net electrical efficiency          [%]
    f2 = specific work = P_net / m_air      [kJ/kg air]

Why these two? For the SAME net power (105 MW):
    - higher efficiency  -> less fuel burned -> lower fuel cost
    - higher specific work -> less air mass flow -> SMALLER, CHEAPER machine
  High pressure ratio helps efficiency but hurts specific work (and the other
  way round), so no single design wins both -> a PARETO FRONT of best
  compromises. NSGA-II (the standard genetic algorithm for this) finds it.

Run:  pip install tespy pymoo    then    python optimize_pr_tit.py
Outputs: pareto_front.png (chart) and pareto_front.csv (data)
=============================================================================
"""
import numpy as np

from tespy.networks import Network
from tespy.components import (
    Source, Sink, Compressor, DiabaticCombustionChamber,
    Turbine, Generator, PowerBus, PowerSink,
)
from tespy.connections import Connection, PowerConnection

from pymoo.core.problem import ElementwiseProblem
from pymoo.algorithms.moo.nsga2 import NSGA2
from pymoo.optimize import minimize


# =============================================================================
# STEP 1 - THE PLANT MODEL AS A REUSABLE FUNCTION
# -----------------------------------------------------------------------------
# Same GE 9E model as simple_gas_turbine.py, with two differences:
#   - TIT (c3.T) is now specified directly, because the optimizer varies it
#     (exhaust temperature becomes a RESULT instead of an input)
#   - fuel pressure raised to 30 bar so the combustor can still be fed
#     when the optimizer tries pressure ratios above 20
# =============================================================================
def build_network():
    nw = Network(iterinfo=False)   # iterinfo=False: silence the solver log
    nw.units.set_defaults(pressure="bar", temperature="degC")

    air_in = Source("air intake")
    fuel_in = Source("fuel supply")
    stack = Sink("exhaust stack")
    comp = Compressor("axial compressor")
    combust = DiabaticCombustionChamber("combustion chamber")
    turb = Turbine("expansion turbine")
    shaft = PowerBus("shaft", num_in=1, num_out=2)
    gen = Generator("generator")
    grid = PowerSink("grid")

    c1 = Connection(air_in, "out1", comp, "in1", label="1")
    c2 = Connection(comp, "out1", combust, "in1", label="2")
    c3 = Connection(combust, "out1", turb, "in1", label="3")
    c4 = Connection(turb, "out1", stack, "in1", label="4")
    c5 = Connection(fuel_in, "out1", combust, "in2", label="5")
    nw.add_conns(c1, c2, c3, c4, c5)

    e1 = PowerConnection(turb, "power", shaft, "power_in1", label="e1")
    e2 = PowerConnection(shaft, "power_out1", comp, "power", label="e2")
    e3 = PowerConnection(shaft, "power_out2", gen, "power_in", label="e3")
    e4 = PowerConnection(gen, "power_out", grid, "power", label="e4")
    nw.add_conns(e1, e2, e3, e4)

    # fixed boundary conditions = your site / machine data
    c1.set_attr(p=1.013, T=30,
                fluid={"Ar": 0.0129, "N2": 0.7553,
                       "CO2": 0.0004, "O2": 0.2314})
    c5.set_attr(p=30, T=25, fluid={"CH4": 0.96, "CO2": 0.03, "N2": 0.01})
    comp.set_attr(eta_s=0.86)
    combust.set_attr(pr=0.97, eta=0.99)
    turb.set_attr(eta_s=0.88)
    c4.set_attr(p=1.013)
    gen.set_attr(eta=0.985)
    e4.set_attr(E=105e6)           # net power fixed at your 105 MW

    return nw


def evaluate(nw, pr, tit):
    """Solve the cycle for one (pr, TIT) pair.

    Returns (efficiency %, specific work kJ/kg) or None if the solver
    fails for that combination.
    """
    nw.get_comp("axial compressor").set_attr(pr=pr)
    nw.get_conn("3").set_attr(T=tit)
    try:
        nw.solve(mode="design")
        if not nw.converged:
            return None
    except Exception:
        return None
    eta = nw.get_conn("e4").E.val / nw.get_comp("combustion chamber").ti.val
    w_spec = nw.get_conn("e4").E.val / nw.get_conn("1").m.val / 1e3
    return eta * 100, w_spec


# =============================================================================
# STEP 2 - WRAP THE MODEL AS A pymoo PROBLEM
# -----------------------------------------------------------------------------
# pymoo always MINIMIZES, so we return the objectives with a minus sign.
# A failed solve gets a huge penalty value -> the genetic algorithm
# automatically avoids that region.
# =============================================================================
class GasTurbineProblem(ElementwiseProblem):

    def __init__(self):
        super().__init__(
            n_var=2,                      # pr, TIT
            n_obj=2,                      # efficiency, specific work
            xl=np.array([8.0, 950.0]),    # lower bounds
            xu=np.array([24.0, 1350.0]),  # upper bounds
        )
        self.nw = build_network()

    def _evaluate(self, x, out, *args, **kwargs):
        result = evaluate(self.nw, pr=x[0], tit=x[1])
        if result is None:
            self.nw = build_network()     # fresh start after a failure
            out["F"] = [1e6, 1e6]         # penalty: dominated by everything
        else:
            eta, w_spec = result
            out["F"] = [-eta, -w_spec]    # minimize the negatives = maximize


# =============================================================================
# STEP 3 - RUN NSGA-II
# -----------------------------------------------------------------------------
# population 40, 30 generations = 1200 cycle simulations. NSGA-II keeps the
# non-dominated designs of each generation and breeds them -> the survivors
# of the last generation ARE the Pareto front.
# =============================================================================
if __name__ == "__main__":

    problem = GasTurbineProblem()

    algorithm = NSGA2(pop_size=40)

    print("Running NSGA-II (40 individuals x 30 generations, "
          "~1200 TESPy simulations) ...")
    res = minimize(problem, algorithm, ("n_gen", 30), seed=1, verbose=True)

    # ------------------------------------------------------------------
    # STEP 4 - COLLECT THE PARETO FRONT
    # ------------------------------------------------------------------
    eta_f = -res.F[:, 0]          # efficiency  [%]
    w_f = -res.F[:, 1]            # specific work [kJ/kg]
    pr_f = res.X[:, 0]
    tit_f = res.X[:, 1]
    order = np.argsort(pr_f)      # sort along the front for a clean line
    eta_f, w_f, pr_f, tit_f = (a[order] for a in (eta_f, w_f, pr_f, tit_f))

    header = f"{'pr':>6} | {'TIT degC':>8} | {'eta %':>6} | {'w kJ/kg':>8}"
    print("\nPARETO FRONT (best compromises, sorted by pressure ratio)")
    print(header)
    print("-" * len(header))
    for pr, tit, eta, w in zip(pr_f, tit_f, eta_f, w_f):
        print(f"{pr:6.1f} | {tit:8.0f} | {eta:6.2f} | {w:8.1f}")

    np.savetxt(
        "pareto_front.csv",
        np.column_stack([pr_f, tit_f, eta_f, w_f]),
        delimiter=",", comments="",
        header="pressure_ratio,TIT_degC,efficiency_pct,specific_work_kJ_per_kg",
        fmt="%.2f",
    )

    # your unit today, for comparison on the chart
    current = evaluate(build_network(), pr=12.6, tit=1118)
    print(f"\nYour 9E today: pr=12.6, TIT=1118 degC "
          f"-> eta={current[0]:.2f} %, w={current[1]:.1f} kJ/kg")

    # reference curve: what different pressure ratios would give at the
    # 9E's OWN firing temperature limit (1118 degC) -> shows that the big
    # efficiency prize on the Pareto front comes from TIT (newer machine
    # class), not from the pressure ratio alone
    nw_ref = build_network()
    ref = [r for pr in np.linspace(8, 24, 33)
           if (r := evaluate(nw_ref, pr=pr, tit=1118)) is not None]
    eta_ref = np.array([r[0] for r in ref])
    w_ref = np.array([r[1] for r in ref])

    # ------------------------------------------------------------------
    # STEP 5 - PLOT THE PARETO FRONT
    # ------------------------------------------------------------------
    import matplotlib.pyplot as plt
    from matplotlib.colors import LinearSegmentedColormap

    # sequential blue ramp (light = low pr, dark = high pr)
    blues = LinearSegmentedColormap.from_list(
        "seq_blue", ["#9ec5f4", "#5598e7", "#256abf", "#0d366b"])

    fig, ax = plt.subplots(figsize=(8, 5.5), dpi=160)
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")

    ax.plot(w_f, eta_f, color="#b7d3f6", lw=2, zorder=1)
    sc = ax.scatter(w_f, eta_f, c=pr_f, cmap=blues, s=42, zorder=2)

    cbar = fig.colorbar(sc, ax=ax, pad=0.02)
    cbar.set_label("compressor pressure ratio", color="#4a4a45")
    cbar.ax.tick_params(colors="#6b6b64")
    cbar.outline.set_visible(False)

    # label a few pressure ratios directly on the front
    for idx, off in ((0, (-42, -4)), (len(pr_f) // 2, (10, -4)),
                     (len(pr_f) - 1, (-44, 2))):
        ax.annotate(f"pr {pr_f[idx]:.0f}", (w_f[idx], eta_f[idx]),
                    textcoords="offset points", xytext=off,
                    fontsize=9, color="#4a4a45")
    ax.annotate("Pareto front (TIT at 1350 °C limit)",
                (w_f[len(pr_f) // 3], eta_f[len(pr_f) // 3]),
                textcoords="offset points", xytext=(-190, 0),
                fontsize=9, color="#4a4a45")

    # reference: pressure-ratio sweep at the 9E's own TIT
    ax.plot(w_ref, eta_ref, color="#8a8a83", lw=2, ls=(0, (4, 3)), zorder=1)
    ax.annotate("same cycle at 9E firing\ntemperature (1118 °C),\npr 8 → 24",
                (w_ref[-1], eta_ref[-1]),
                textcoords="offset points", xytext=(12, -34),
                fontsize=9, color="#4a4a45")

    # your machine today
    ax.scatter(*current[::-1], marker="D", s=70, color="#26251f",
               edgecolor="white", linewidth=1.5, zorder=3)
    ax.annotate("GE 9E today\n(pr 12.6, TIT 1118 °C)", current[::-1],
                textcoords="offset points", xytext=(10, 6),
                fontsize=9, color="#4a4a45")

    ax.set_xlabel("specific work  [kJ per kg air]  →  smaller machine",
                  color="#4a4a45")
    ax.set_ylabel("net electrical efficiency  [%]  →  less fuel",
                  color="#4a4a45")
    ax.set_title("Pareto front: efficiency vs. specific work at 105 MW net",
                 color="#26251f", pad=14)
    ax.grid(color="#f0efec", lw=0.8)
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.tick_params(colors="#6b6b64", length=0)

    fig.tight_layout()
    fig.savefig("pareto_front.png", bbox_inches="tight")
    print("\nSaved: pareto_front.png and pareto_front.csv")
