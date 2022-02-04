# Example.TypeScript.OptionBacktesting.Beta

### About the project
This project aimes to be an option backtesting application. The current version of the code reconstructs expired option Refinitiv Identification Codes (RIC) following the logic of RIC construction rules and the rules specified by the exchange where the option is traded. Further, based on the actual historical pricing we create and offset (based on a VIX trigger) several option transactions accross 7 (2015-2021). The current version enables to test [Short Iron Condor strategy](https://www.fidelity.com/learning-center/investment-products/options/options-strategy-guide/short-iron-condor-spread). In the future more strategies would be added.

More about the project can be found [here](https://developers.refinitiv.com/en/article-catalog/article/finding-expired-options-and-backtesting-a-short-iron-condor-stra)


### Structure of the files
The functions enabling to reconstruct expired option RICs, create and offset option transactions for the backtesting purposes are grouped in 3 main folders under **src** folder above:
* **APIRequests** -  This folder includes function for requesting data from Refinitiv APIs. Function *getCorpEvents.ts* requests stock split corporate events which are further used to adjust stock prices in case of stock split event. Function *getHistPrices.ts* is used to request historical prices for options and the underlying assets.
* **Common** - This folder contains the *session.ts* file which will allow the creating and opening API sessions for data requests.
* **mainFunctions** - As the name suggests this folder includes the main functions for reconstructing option RICs(*getPotentialRICs.ts*), opening (*getTransactions.ts*, *getPairTransactions.ts*) and offseting (*getOffsetTrans.ts*) option transactions and calculating the transaction outcome(*getTransOutcome*) for backtesting strategy.  
* **supplFunctions** - The last folder includes functions which are used to build the main functions above. This includes the requesting transaction (first business day or third friday of each month (*getTransDates.ts*)) and expiration dates (third Friday of each month (*getExpDates.ts*)) for options. Functions *sortOptionRICs.ts* and *zipArray.ts* are used to sort the RICs of each month in order of closeness of options contract strike price with the OTM price. The function *getAdjFactors.ts* calculates adjustment factor based on the corporate event list and the request date. Finally, *getMath.ts* was includes several mathematical operations which are used by other functions.

### How to run
Although the abovementioned functions can be run separately, that would allow only to get the specific part of the application (such as potential RICs, open transactions, offseet transactions etc). The final output, which is the list of option transactions along with the prices, P&L details etc, can be achieved by just runing the function ***runIronCondor.ts*** in the **src** folder. That function will call the required functions with specified argument inputs and will return object with RICs, transaction details (date, price, OTM size etc) and the outcome. This outcome will be further use to report and visualize the backtesing results.
