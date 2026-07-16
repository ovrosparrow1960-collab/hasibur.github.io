# Simple-Cycle Gas Turbine Power Plant Model (TESPy)

A working thermodynamic model of a simple-cycle gas turbine power plant
(Brayton cycle), built with [TESPy](https://tespy.readthedocs.io).
The code is in [`simple_gas_turbine.py`](simple_gas_turbine.py).

```
                 fuel (5)
                    |
                    v
 air (1)  [COMPRESSOR] --(2)--> [COMBUSTOR] --(3)--> [TURBINE] --(4)--> stack
               ^                                          |
               |__________________ shaft _________________|
                                     |
                                [GENERATOR] ---> grid (net MW)
```

---

## 1. How to run it (even from your phone)

The GitHub app can only **edit** files, it cannot run Python.
Easiest way to run from a phone: **Google Colab** (free, works in browser).

1. Open [colab.research.google.com](https://colab.research.google.com) → New notebook.
2. First cell:
   ```
   !pip install tespy
   ```
3. Second cell: paste the whole content of `simple_gas_turbine.py` and run.

On a PC:

```bash
pip install tespy
python simple_gas_turbine.py
```

---

## 2. Which portion of the code does which part (teaching guide)

The script is divided into 7 numbered STEPs. Here is what each one is,
why it is needed, and what plant data goes into it.

### STEP 1 — Imports
**What it is:** loads the TESPy building blocks.
**Required from you:** nothing.
- `Network` = the whole plant (holds everything, runs the solver)
- `Source` / `Sink` = where fluid enters (air, fuel) and leaves (exhaust)
- `Compressor`, `DiabaticCombustionChamber`, `Turbine` = the 3 real machines
- `PowerBus` = the shaft, `Generator` = the alternator, `PowerSink` = the grid

### STEP 2 — Create the Network
**What it is:** creates the empty plant and sets the units (bar, °C).
**Required from you:** nothing — but pick the units your DCS uses so you can
type numbers directly from your screens.

### STEP 3 — Create the components
**What it is:** one Python object per physical machine.
**Required from you:** nothing yet (names are just labels).

### STEP 4 — Connections
**What it is:** the "pipes" between machines, and the shaft/cables.
**Required from you:** nothing — but understand the numbering, because all
plant data is attached to these points:

| Connection | Physical location in your plant |
|---|---|
| `c1` (1) | air intake filter house → compressor inlet |
| `c2` (2) | compressor discharge → combustor |
| `c3` (3) | combustor exit → turbine inlet (firing temperature) |
| `c4` (4) | turbine exhaust → stack |
| `c5` (5) | fuel gas skid → combustor |
| `e1..e4` | turbine shaft → compressor / generator → grid |

### STEP 5 — Plant data (★ THIS is where YOUR real data goes)
Every `set_attr(...)` line marked with ★ must be replaced with your values:

| Code line | Data needed | Where to get it in a real plant |
|---|---|---|
| `c1.set_attr(p=, T=)` | ambient pressure & temperature | site weather station / DCS |
| `c5.set_attr(fluid=)` | fuel gas composition (mass fractions, sum = 1) | gas supplier lab report / chromatograph |
| `c5.set_attr(p=, T=)` | fuel gas pressure & temperature | fuel skid instruments |
| `comp.set_attr(pr=)` | compressor pressure ratio = p2 ÷ p1 | OEM datasheet, or DCS discharge-pressure sensor |
| `comp.set_attr(eta_s=)` | compressor isentropic efficiency | OEM / performance test (typ. 0.82–0.88) |
| `combust.set_attr(pr=)` | combustor pressure drop (0.97 = 3 % loss) | OEM datasheet |
| `combust.set_attr(eta=)` | combustion efficiency (heat loss) | OEM datasheet (typ. 0.98–0.995) |
| `c3.set_attr(T=)` | turbine inlet temperature (TIT) — the most important number | OEM datasheet (DCS usually shows exhaust T, not TIT) |
| `c4.set_attr(p=)` | exhaust pressure ≈ ambient | leave ≈ 1.013 bar |
| `turb.set_attr(eta_s=)` | turbine isentropic efficiency | OEM / performance test (typ. 0.85–0.92) |
| `gen.set_attr(eta=)` | generator efficiency | OEM datasheet (typ. 0.985) |
| `e4.set_attr(E=)` | net electrical output in **watts** (50 MW → `50e6`) | your energy meter / DCS MW reading |

**Rule of thumb about "how many values to give":** TESPy needs exactly as many
specifications as unknowns. If you set one value twice in different ways
(over-determined) or forget one (under-determined), the solver will tell you.
The set above is exactly right — if you want to *fix the air mass flow*
instead of the net power, add `c1.set_attr(m=...)` and **remove**
`e4.set_attr(E=...)`. Always one in, one out.

### STEP 6 — Solve
**What it is:** `nw.solve(mode="design")` runs a Newton solver on all the
energy/mass balances. Converged = residual around `1e-6` in the log.
**Required from you:** nothing, just read the log.

### STEP 7 — Results / KPIs
**What it is:** prints the numbers you should compare with the real plant:
net MW, fuel heat input, efficiency, air & fuel mass flow, compressor
discharge T/p, exhaust temperature.

---

## 3. How to validate against your real plant data

1. Enter your known data in STEP 5 (ambient, fuel, pr, TIT, net MW).
2. Run the model.
3. Compare the *calculated* values with your DCS:
   - **Exhaust temperature (c4)** — best single check. If model is too hot,
     your real `eta_s` (turbine) is probably higher, or TIT lower.
   - **Compressor discharge temperature (c2)** — checks compressor `eta_s`.
   - **Fuel flow (c5)** — checks combustor efficiency and TIT together.
4. Adjust `eta_s`, `pr`, `TIT` a little at a time until model ≈ plant.
   Then you have a validated model you can use for what-if studies
   (hot day performance, part load, degradation, upgrades).

## 4. Example output (default ★ values, 50 MW class unit)

```
Net electrical output      :      50.00 MW
Turbine shaft power        :     106.35 MW
Compressor consumption     :      55.58 MW
Fuel heat input (LHV)      :     137.04 MW
Net electrical efficiency  :      36.49 %
Air mass flow              :     135.43 kg/s
Fuel mass flow             :      2.854 kg/s
Compressor discharge T     :      422.2 degC
Exhaust temperature        :      575.6 degC
```

These are realistic values for a modern 50 MW-class simple-cycle machine.

## 5. Common errors and fixes

| Error / symptom | Cause | Fix |
|---|---|---|
| "network is over-determined" | you set the same thing twice (e.g. both net power `E` and air mass flow `m`) | remove one specification |
| "network is under-determined" | a required value missing | add the missing `set_attr` |
| fuel pressure error in combustor | `c5` pressure below compressor discharge | set fuel `p` higher than `p1 × pr` |
| solver does not converge | unrealistic inputs (e.g. TIT too low for the pressure ratio) | start from the defaults, change one value at a time |
| composition error | fluid fractions don't sum to 1 | fix the fractions |

## 6. Next steps you can build on top of this

- **Part-load / offdesign:** save the design (`nw.save(...)`) and rerun with
  `nw.solve("offdesign", design_path=...)` using compressor/turbine
  characteristic curves.
- **Combined cycle:** add a heat-recovery steam generator (HeatExchanger)
  on connection 4.
- **Optimization:** the TESPy
  [optimization tutorial](https://tespy.readthedocs.io/en/main/integration/optimization.html)
  shows how to wrap the model in an `OptimizationProblem` class with pygmo
  to e.g. find the pressure ratio that maximizes efficiency.
