# Example.TypeScript.OptionBacktesting.Beta

### About the project
This project aimes to be an option backtesting application. The current version of the code reconstructs expired option Refinitiv Identification Codes (RIC) following the logic of RIC construction rules and the rules specified by the exchange where the option is traded. Further, based on the actual historical pricing we create and offset (based on a VIX trigger) several option transactions accross 7 (2015-2021). The current version enables to test [Short Iron Condor strategy](https://www.fidelity.com/learning-center/investment-products/options/options-strategy-guide/short-iron-condor-spread). In the future more strategies would be added.

More about the project can be found [here](https://developers.refinitiv.com/en/article-catalog/article/finding-expired-options-and-backtesting-a-short-iron-condor-stra)


### Structure of the files
The functions enabling to reconstruct expired option RICs, create and offset option transactions for the backtesting purposes are grouped in 3 main folders under **src** folder above:
* APIRequests -  

### How to run
