export default function catchAsync(fn) {
    return (req, res, next) => {
        if (typeof fn === 'function') {
            fn(req, res, next).catch(next);
        } else {
            next();
        }
    }
}