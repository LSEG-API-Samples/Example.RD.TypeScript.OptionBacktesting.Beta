module.exports = (func: (arg0: any, arg1: any, arg2: any) => Promise<any>) => {
    return (req: any, res: any, next: any) => {
        func(req, res, next).catch(next);
    }
}