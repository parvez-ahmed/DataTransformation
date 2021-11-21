# Gartner Test

Tools and technologies used:
* [Nodejs]

## Prerequisites
1. From project root folder install all the dependencies: `npm i` or `npm install`

## Run
`npm start`: will run the application and generate the resultset.json file in the same folter

## Description About the Code
When you run npm start, this will execute the start function in index.js file. This function will be the main function of the file and will call all the required function to generate the result.
Firstly code will read the data.json file and after reading data will be send to findSubset method, this method will produce the data as per the problem statement and return the data subset. after that will call the sort method that will sort the data as per the timestamp and at end will write the sorted data in resultset.json file 


### Author
* Parvej Ahmed
