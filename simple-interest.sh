#!/bin/bash
# A script to calculate simple interest
# Formula: Simple Interest = (Principal * Rate * Time) / 100

echo "Enter the principal:"
read principal

echo "Enter rate of interest per year (%):"
read rate

echo "Enter time period in years:"
read time

interest=$(echo "scale=2; ($principal * $rate * $time) / 100" | bc)

echo "The simple interest is: $interest"
