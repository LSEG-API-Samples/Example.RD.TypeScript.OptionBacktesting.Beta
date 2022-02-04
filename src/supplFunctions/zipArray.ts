// https://www.tutorialspoint.com/javascript-equivalent-of-python-s-zip-function
module.exports = function zip(...arr: any) {
    const zipped: any[] = [];
    arr.forEach((element: any[], ind: string | number) => {
        element.forEach((el, index) => {
            if (!zipped[index]) {
                zipped[index] = [];
            };
            if (!zipped[index][ind]) {
                zipped[index][ind] = [];
            };
            zipped[index][ind] = el || '';
        });
    });
    return zipped;
};