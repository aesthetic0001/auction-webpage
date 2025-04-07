export function toDHMS(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const result = [];
    if (d > 0) {
        result.push(`${d}d`);
    }
    if (h > 0) {
        result.push(`${h}h`);
    }
    if (m > 0) {
        result.push(`${m}m`);
    }
    result.push(`${s}s`);
    return result.join(" ")
}

export function intToString(number, floor = true, rounding = 10) {
    if (number < 1000) {
        return String(Math.floor(number));
    } else if (number < 10000) {
        if (floor) {
            return (Math.floor((number / 1000) * rounding) / rounding).toFixed(rounding.toString().length - 1) + "K";
        } else {
            return (Math.ceil((number / 1000) * rounding) / rounding).toFixed(rounding.toString().length - 1) + "K";
        }
    } else if (number < 1000000) {
        if (floor) {
            return Math.floor(number / 1000) + "K";
        } else {
            return Math.ceil(number / 1000) + "K";
        }
    } else if (number < 1000000000) {
        if (floor) {
            return (Math.floor((number / 1000 / 1000) * rounding) / rounding).toFixed(rounding.toString().length - 1) + "M";
        } else {
            return (Math.ceil((number / 1000 / 1000) * rounding) / rounding).toFixed(rounding.toString().length - 1) + "M";
        }
    } else if (floor) {
        return (
            (Math.floor((number / 1000 / 1000 / 1000) * rounding * 10) / (rounding * 10)).toFixed(
                rounding.toString().length
            ) + "B"
        );
    } else {
        return (
            (Math.ceil((number / 1000 / 1000 / 1000) * rounding * 10) / (rounding * 10)).toFixed(rounding.toString().length) +
            "B"
        );
    }
}
