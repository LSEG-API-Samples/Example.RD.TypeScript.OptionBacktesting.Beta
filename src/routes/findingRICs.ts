export { };
const express = require('express');
const router = express.Router();
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { findRICSchema } = require('../schemas.ts');
const ricPrices = require('../models/ricPrices');

const getOptionRIC = require('../findRics/getOptionRIC');

import { getSession } from '../Common/session';
const session = getSession();

const validateRICRequest = (req: any, res: any, next: any) => {
    const { error } = findRICSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el: { message: any; }) => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/newRIC', async (req: any, res: any) => {
    res.render('findingRICs/newRIC')
});

router.get('/showRIC', async (req: any, res: any) => {
    const allricPrices = await ricPrices.find({}).sort({ createdDate: -1 });
    res.render('findingRICs/showRIC', { allricPrices })
});


router.post('/newRIC', validateRICRequest, catchAsync(async (req: any, res: any) => {
    await session.open()
    let type = ''
    if (req.body.type === 'Call') {
        type = 'C'
    }
    else {
        type = 'P'
    }
    let objects: any = []
    await getOptionRIC(req.body.asset, req.body.maturity, req.body.strike, type, session).then((output: any) => {
        let i = -1
        // console.log(output[0].length)
        if (Object.keys(output[0]).length > 0) {
            for (let [key, value] of Object.entries(output[0])) {
                i++
                let vals = {
                    asset: req.body.asset,
                    strike: req.body.strike,
                    maturity: req.body.maturity,
                    ric: value,
                    optionType: req.body.type,
                    exchange: key,
                    prices: output[1][i],
                    createdDate: moment().format()
                }
                let newricPrices = new ricPrices(vals)
                newricPrices.save()
                objects.push(newricPrices)
            }
        }
        else {
            objects = output[2]
        }
    })
    res.render(`findingRICs/foundRIC`, { objects });
    await session.close();
}))


router.get('/showPrices/:id', catchAsync(async (req: any, res: any) => {
    const result = await ricPrices.findById(req.params.id)
    const pricesValues = JSON.stringify(result.prices);
    res.render('findingRICs/showPrices', { pricesValues, result });
}));

router.delete('/showRIC/:id', catchAsync(async (req: any, res: any) => {
    let ric = await ricPrices.findById(req.params.id)
    console.log('ric')
    await ricPrices.findByIdAndDelete(req.params.id);
    // req.flash('success', 'Successfully deleted backtesting outcome!');
    res.render('findingRICs/newRIC');
}))

module.exports = router;


