# EPOC estimation for kayaking training.
# This script implements a simple model to estimate excess post-exercise
# oxygen consumption (EPOC) based on power and heart rate data sampled
# every 5 seconds.

from typing import Iterable, Tuple, List


def estimate_epoc(
    power: Iterable[float],
    hr: Iterable[float],
    p_vo2max: float,
    hr_rest: float,
    hr_max: float,
    k_down: float = 1.0,
    k_up: float = 15.0,
    n: float = 2.0,
    beta: float = 0.05,
    I0: float = 0.4,
    dt: float = 5.0 / 60.0,
) -> Tuple[float, List[float]]:
    """Estimate EPOC over a workout.

    Parameters
    ----------
    power : Iterable[float]
        Sequence of power readings in Watts sampled every 5 seconds.
    hr : Iterable[float]
        Sequence of heart-rate readings in beats per minute sampled every
        5 seconds.
    p_vo2max : float
        Power output at VO2max for the athlete in Watts.
    hr_rest : float
        Resting heart rate in beats per minute.
    hr_max : float
        Maximum heart rate in beats per minute.
    k_down : float, optional
        Recovery constant when intensity is below threshold.
    k_up : float, optional
        Accumulation constant when intensity is above threshold.
    n : float, optional
        Non-linearity exponent for intensity.
    beta : float, optional
        Saturation factor.
    I0 : float, optional
        Intensity threshold above which EPOC starts accumulating.
    dt : float, optional
        Time step in minutes. Default is 5 seconds -> 5/60 minutes.

    Returns
    -------
    Tuple[float, List[float]]
        Final EPOC value and the series of EPOC values for each step.
    """
    E = 0.0
    series: List[float] = []

    for p, h in zip(power, hr):
        I_W = p / p_vo2max if p_vo2max else 0.0
        denom = hr_max - hr_rest
        I_HR = (h - hr_rest) / denom if denom else 0.0
        I = max(I_W, I_HR)

        if I <= I0:
            dE = -k_down * E * dt
        else:
            dE = (k_up / (1.0 + beta * E)) * ((I - I0) ** n) * dt

        E = max(0.0, E + dE)
        series.append(E)

    return E, series


if __name__ == "__main__":
    # Example usage with dummy data.
    P = [100, 150, 200, 250, 300, 150, 100]
    HR = [120, 130, 140, 160, 170, 150, 120]
    epoc, epoc_series = estimate_epoc(
        P, HR, p_vo2max=300, hr_rest=60, hr_max=180
    )
    print(f"Total EPOC: {epoc:.2f}")
    print("Series:", epoc_series)
