export { };
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { backtestingSchema } = require('../schemas.ts');
const Outcome = require('../models/backtestingResults');

const shortIC = require('../runIronCondor');
const toJSON = require('../supplFunctions/toJSON');
const getDataForVisuals = require('../supplFunctions/getDataVisuals')
const PandLTotal = getDataForVisuals.PandLTotal;
const ExerExpOutcome = getDataForVisuals.ExerExpOutcome;
const countTrans = getDataForVisuals.countTrans;
const ExerExpCount = getDataForVisuals.ExerExpCountOutcome;
const PandLComponents = getDataForVisuals.PandLComponents;
const PandLMonthly = getDataForVisuals.PandLMonthly;
import { getSession } from '../Common/session';
const session = getSession();

const validateCampground = (req: any, res: any, next: any) => {
    const { error } = backtestingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el: { message: any; }) => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/new', async (req: any, res: any) => {
    res.render('backtestingOutcomes/new')
});

router.get('/strategies', catchAsync(async (req: any, res: any) => {
    const shortIC = await Outcome.find({ "_id": ("620ccab798c2e92a328d743c") });
    const straddle = await Outcome.find({ "_id": ("620ccab798c2e92a328d743c") });
    if (!shortIC || !straddle) {
        req.flash('error', 'Cannot find that backtesting outcome!');
        return res.redirect('/backtestingOutcomes/new');
    }
    res.render('strategies', { shortIC, straddle })
}));

router.get('/', async (req: any, res: any) => {
    const outcomes = await Outcome.find({});
    res.render('backtestingOutcomes/outcomes', { outcomes })
});

router.post('/', validateCampground, catchAsync(async (req: any, res: any) => {
    await session.open()
    await shortIC(req.body.sYear, req.body.eYear, req.body.transDay, req.body.asset, req.body.sLeg,
        req.body.lLeg, 5, 'short', 'long', session, req.body.offset).then((allOptionTrans: any) => {
            const title = `Short Iron condor strategy backtesting results for ${req.body.asset} for the period of ${req.body.sYear} to ${req.body.eYear} with ${req.body.sLeg}, ${req.body.lLeg} legs`;
            const resultObj = toJSON(allOptionTrans, title);
            const backtestOutcome = new Outcome(resultObj);
            backtestOutcome.save();
            req.flash('success', 'Option transactions are successfully created');
            res.redirect(`/backtestingOutcomes/${backtestOutcome._id}`);
        })
    await session.close();
}))

router.get('/:id', catchAsync(async (req: any, res: any) => {
    const outcome = await Outcome.findById(req.params.id)
    const outcomeValues = JSON.stringify(outcome.values);
    const PandLVisOutput = PandLTotal(outcome.values);
    const ExerExpVisOutput = ExerExpOutcome(outcome.values);
    const countTransVisOutput = countTrans(outcome.values);
    const ExerExpCountVisOutput = ExerExpCount(outcome.values)
    const PandLVisComponents = PandLComponents(outcome.values)
    const PandLMonthlyVis = PandLMonthly(outcome.values);
    res.render('backtestingOutcomes/show', {
        outcomeValues, PandLVisOutput, ExerExpVisOutput, countTransVisOutput, ExerExpCountVisOutput,
        PandLVisComponents, PandLMonthlyVis
    });
}));

router.delete('/:id', catchAsync(async (req: any, res: any) => {
    const { id } = req.params;
    await Outcome.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted backtesting outcome!');
    res.redirect('/backtestingOutcomes');
}))

module.exports = router;

