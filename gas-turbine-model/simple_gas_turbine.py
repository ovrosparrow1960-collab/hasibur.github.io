# -*- coding: utf-8 -*-
"""
=============================================================================
SIMPLE-CYCLE GAS TURBINE POWER PLANT MODEL (Brayton / Joule cycle)
Built with TESPy  (tested with tespy 0.10.x)
=============================================================================

Physical layout of the plant this script models:

                     fuel (natural gas)
                          |
                          v  (5)
   air (1)   +------+   +----+   (3)  +---------+   (4)  exhaust
   ------->  | COMP |-->| CC |------->| TURBINE |-------> to stack
             +------+(2)+----+        +---------+
                ^                          |
                |        shaft             |
                +---------[ POWER BUS ]<---+
                               |
                               v
                         [ GENERATOR ] ---> electricity to grid

  (1) ambient air intake          (4) turbine exhaust / stack
  (2) compressor discharge        (5) fuel supply to combustor
  (3) turbine inlet (firing T)

-----------------------------------------------------------------------------
DATA YOU MUST TAKE FROM YOUR REAL POWER PLANT  (replace the ★ values below)
-----------------------------------------------------------------------------
| Where in code        | Plant data needed                | Typical source   |
|----------------------|----------------------------------|------------------|
| c1.set_attr(T, p)    | Ambient temperature & pressure   | Site weather log |
| c5.set_attr(...)     | Fuel gas composition, T, p       | Gas supplier lab |
| compressor pr        | Pressure ratio (p2 / p1)         | OEM datasheet /  |
|                      |                                  | DCS: p2 sensor   |
| compressor eta_s     | Isentropic efficiency            | OEM / heat-bal.  |
| cc pr, eta           | Combustor pressure loss & losses | OEM datasheet    |
| c4.set_attr(T)       | Measured exhaust temperature     | DCS exhaust TC   |
|                      | (model then CALCULATES the TIT)  |                  |
| turbine eta_s        | Isentropic efficiency            | OEM / heat-bal.  |
| generator eta        | Generator efficiency             | OEM datasheet    |
| e_grid.set_attr(E)   | Net electrical output (MW)       | Energy meter     |
-----------------------------------------------------------------------------
You give the model: ambient, fuel, pr, efficiencies, TIT and net MW.
The model gives back: air & fuel mass flow, all intermediate T/p,
fuel heat input, and cycle efficiency -> compare them with your DCS values.
=============================================================================
"""

# =============================================================================
# STEP 1 - IMPORTS
# -----------------------------------------------------------------------------
# Network .... the "container" that holds components + connections and solves
#              the system of equations
# Components . the physical machines of the plant
# Connection . a pipe/duct carrying fluid between two components
# PowerConnection ... a shaft/cable carrying mechanical/electrical power
# =============================================================================
from tespy.networks import Network
from tespy.components import (
    Source,                     # delivers a fluid INTO the model (air, fuel)
    Sink,                       # absorbs a fluid OUT of the model (exhaust)
    Compressor,                 # axial compressor of the gas turbine
    DiabaticCombustionChamber,  # combustor (allows pressure & heat losses)
    Turbine,                    # expansion turbine
    Generator,                  # converts shaft power -> electrical power
    PowerBus,                   # the shaft: splits turbine power between
                                # compressor and generator
    PowerSink,                  # the electrical grid
)
from tespy.connections import Connection, PowerConnection


# =============================================================================
# STEP 2 - CREATE THE NETWORK
# -----------------------------------------------------------------------------
# Choose the units you want to type your plant data in.
# Everything below is then written in bar / degC / MW - like your DCS screens.
# =============================================================================
nw = Network()
nw.units.set_defaults(
    pressure="bar",           # you type pressures in bar
    temperature="degC",       # you type temperatures in degC
    enthalpy="kJ/kg",         # results tables show enthalpy in kJ/kg
)


# =============================================================================
# STEP 3 - CREATE THE COMPONENTS
# -----------------------------------------------------------------------------
# One python object per physical machine. The string is just its label.
# =============================================================================
air_in   = Source("air intake")
fuel_in  = Source("fuel supply")
stack    = Sink("exhaust stack")

comp     = Compressor("axial compressor")
combust  = DiabaticCombustionChamber("combustion chamber")
turb     = Turbine("expansion turbine")

shaft    = PowerBus("shaft", num_in=1, num_out=2)  # 1 input (turbine),
                                                   # 2 outputs (comp + gen)
gen      = Generator("generator")
grid     = PowerSink("grid")


# =============================================================================
# STEP 4 - CONNECT THE COMPONENTS (the "pipes" and the "shaft")
# -----------------------------------------------------------------------------
# Fluid path:   air -> compressor -> combustor -> turbine -> stack
#               fuel ------------------^ (second combustor inlet "in2")
#
# Power path:   turbine ==> shaft ==> compressor   (the turbine drives
#               turbine ==> shaft ==> generator ==> grid   its own compressor)
# =============================================================================
c1 = Connection(air_in,  "out1", comp,    "in1", label="1")  # ambient air
c2 = Connection(comp,    "out1", combust, "in1", label="2")  # compressed air
c3 = Connection(combust, "out1", turb,    "in1", label="3")  # hot gas (TIT)
c4 = Connection(turb,    "out1", stack,   "in1", label="4")  # exhaust
c5 = Connection(fuel_in, "out1", combust, "in2", label="5")  # fuel gas

nw.add_conns(c1, c2, c3, c4, c5)

e1 = PowerConnection(turb,  "power",      shaft, "power_in1",  label="e1")
e2 = PowerConnection(shaft, "power_out1", comp,  "power",      label="e2")
e3 = PowerConnection(shaft, "power_out2", gen,   "power_in",   label="e3")
e4 = PowerConnection(gen,   "power_out",  grid,  "power",      label="e4")

nw.add_conns(e1, e2, e3, e4)


# =============================================================================
# STEP 5 - SET THE PLANT DATA
# -----------------------------------------------------------------------------
# Values below = GE Frame 9E, site full load 105 MW, measured exhaust
# temperature ~565 degC.  (★ = value taken / to be refined from plant data)
#
# TRICK USED HERE: the DCS does not show the turbine inlet temperature (TIT),
# but it DOES show the exhaust temperature. So instead of specifying TIT on
# connection 3, we specify the MEASURED exhaust temperature on connection 4
# and let TESPy calculate the TIT. Comparing the calculated TIT with the
# known 9E firing temperature (~1124 degC) validates the whole model.
# =============================================================================

# --- 5a. Ambient air at the compressor inlet (connection 1) ----------------
# Composition = standard dry air in mass fractions. Keep it unless you want
# to model humidity effects.
c1.set_attr(
    p=1.013,      # ★ ambient pressure   [bar]  (site barometer)
    T=30,         # ★ ambient temperature [degC] (hot site -> 105 MW,
                  #   below the 126 MW ISO rating of the 9E)
    fluid={"Ar": 0.0129, "N2": 0.7553, "CO2": 0.0004, "O2": 0.2314},
)

# --- 5b. Fuel gas at the combustor (connection 5) ---------------------------
# ★ Replace composition with your gas chromatograph analysis (mass fractions,
#   must sum to 1). CH4 = methane. Add e.g. "C2H6": ... for ethane if present.
c5.set_attr(
    p=20,         # ★ fuel gas supply pressure [bar] - must be ABOVE the
                  #   compressor discharge pressure (~12.8 bar) so gas can
                  #   enter the combustor
    T=25,         # ★ fuel gas supply temperature [degC]
    fluid={"CH4": 0.96, "CO2": 0.03, "N2": 0.01},  # ★ replace with your
                  #   gas analysis (mass fractions, must sum to 1)
)

# --- 5c. Compressor ----------------------------------------------------------
comp.set_attr(
    pr=12.6,      # GE Frame 9E pressure ratio (OEM datasheet)
    eta_s=0.86,   # ★ isentropic efficiency (0.82-0.88 typical) - refine by
                  #   comparing calculated compressor discharge T with DCS
)

# --- 5d. Combustion chamber --------------------------------------------------
combust.set_attr(
    pr=0.97,      # ★ pressure kept: p3/p2 (3 % combustor pressure drop)
    eta=0.99,     # ★ combustion efficiency (1 % heat loss to casing)
)

# --- 5e. Turbine -------------------------------------------------------------
c4.set_attr(
    p=1.013,      # exhaust discharges to ambient pressure [bar]
    T=565,        # ★ MEASURED exhaust temperature at full load [degC]
                  #   (your DCS shows 560-575 at full load)
                  #   -> TESPy calculates the TIT from this
)
turb.set_attr(eta_s=0.88)  # ★ isentropic efficiency (0.85-0.92 typical)

# --- 5f. Generator and net output -------------------------------------------
gen.set_attr(eta=0.985)  # ★ generator efficiency (OEM datasheet)
e4.set_attr(E=105e6)     # ★ NET electrical output = your full load 105 MW
                         #   in watts -> TESPy computes the air/fuel flow
                         #   that delivers exactly this power


# =============================================================================
# STEP 6 - SOLVE
# -----------------------------------------------------------------------------
# "design" mode: TESPy builds one equation per specification above and solves
# them simultaneously with a Newton solver. If it converges, the printed
# residual at the bottom of the iteration log is ~1e-6 or smaller.
# =============================================================================
nw.solve(mode="design")
nw.print_results()


# =============================================================================
# STEP 7 - KEY PERFORMANCE INDICATORS
# -----------------------------------------------------------------------------
# Compare every number printed here against your real plant (DCS / performance
# test report). If they deviate, tune eta_s, pr and TIT until they match ->
# then you have a validated digital twin of your unit.
# =============================================================================
P_net     = e4.E.val                      # net electrical power [W]
P_turbine = e1.E.val                      # turbine shaft power  [W]
P_comp    = e2.E.val                      # compressor demand    [W]
Q_fuel    = combust.ti.val                # fuel heat input (LHV) [W]
eta_cycle = P_net / Q_fuel                # net electrical efficiency

print("\n" + "=" * 60)
print("FULL LOAD (105 MW) - compare with your DCS")
print("=" * 60)
print(f"Net electrical output      : {P_net / 1e6:10.2f} MW")
print(f"Turbine shaft power        : {P_turbine / 1e6:10.2f} MW")
print(f"Compressor consumption     : {P_comp / 1e6:10.2f} MW")
print(f"Fuel heat input (LHV)      : {Q_fuel / 1e6:10.2f} MW")
print(f"Net electrical efficiency  : {eta_cycle * 100:10.2f} %")
print(f"Air mass flow              : {c1.m.val:10.2f} kg/s")
print(f"Fuel mass flow             : {c5.m.val:10.3f} kg/s")
print(f"Compressor discharge T     : {c2.T.val:10.1f} degC")
print(f"Compressor discharge p     : {c2.p.val:10.2f} bar")
print(f"CALCULATED TIT             : {c3.T.val:10.1f} degC   <- check vs")
print(f"                                            9E firing T ~1124 degC")
print(f"Exhaust temperature        : {c4.T.val:10.1f} degC   (input, DCS)")
print("=" * 60)


# =============================================================================
# STEP 8 - PART LOAD CHECK
# -----------------------------------------------------------------------------
# Your plant: exhaust temperature drops to 440-450 degC at part load.
# We re-solve the SAME model with part-load data: lower net power and the
# measured part-load exhaust temperature. TESPy then shows how far the
# machine turns its firing temperature down.
#
# NOTE: this is a simplification - it keeps compressor pr and eta_s constant,
# i.e. it ignores the IGV (inlet guide vane) control of the real 9E. For
# accurate part-load studies use TESPy's offdesign mode with characteristic
# curves (see README, section 6).
# =============================================================================
e4.set_attr(E=70e6)   # ★ part-load net power [W] - set YOUR actual MW here
c4.set_attr(T=445)    # ★ measured part-load exhaust temperature [degC]

nw.solve(mode="design")

print("\n" + "=" * 60)
print("PART LOAD (70 MW) - compare with your DCS")
print("=" * 60)
print(f"Net electrical output      : {e4.E.val / 1e6:10.2f} MW")
print(f"Fuel heat input (LHV)      : {combust.ti.val / 1e6:10.2f} MW")
print(f"Net electrical efficiency  : {e4.E.val / combust.ti.val * 100:10.2f} %")
print(f"Fuel mass flow             : {c5.m.val:10.3f} kg/s")
print(f"CALCULATED TIT             : {c3.T.val:10.1f} degC")
print(f"Exhaust temperature        : {c4.T.val:10.1f} degC   (input, DCS)")
print("=" * 60)
