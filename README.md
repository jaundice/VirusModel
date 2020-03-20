# VirusModel
Thought excercise in modelling Covid-19 . You can experiment with it at https://jsfiddle.net/jaundice/d4wp6u9k/9/ (This is my original model)

I'm not a medical professional, but I thought it would be interesting to model interactions between members of a population through home, work, social and other activities over time and how a virus might be transmitted through the population in different senarios. 

I am now trying to enhance the first version with changes over time with policy and behaviour and impact on / from health service

# If YOU have any other pertinent knowledge please add it to a support ticket on the issues tab
(or fork and submit a PR if you know what that is)


# Working knowledge


## current knowledge: 
* probably 80% of infections go unregistered


from https://www.worldometers.info/demographics/uk-demographics/
* UK population 67886011
* 82.9 % urban 

From skynews interview with ICU doctor
* 10% hospitalised
* 4% ICU
* 2% Dead


from https://www.imperial.ac.uk/media/imperial-college/medicine/sph/ide/gida-fellowships/Imperial-College-COVID19-NPI-modelling-16-03-2020.pdf?fbclid=IwAR0vqO4HI3pA-2oV_HdGBQt2t5D0A_ENY6Mhbm4Yi_y88Bbg3Fskew2SYN4 
<pre>
Age-group(years),   % symptomatic cases requiring hospitalisation,  % hospitalised cases requiring critical care,   Infection Fatality Ratio
0 to 9              0.1%                                            5.0%                                            0.002%
10 to 19            0.3%                                            5.0%                                            0.006%
20 to 29            1.2%                                            5.0%                                            0.03%
30 to 39            3.2%                                            5.0%                                            0.08%
40 to 49            4.9%                                            6.3%                                            0.15%
50 to 59            10.2%                                           12.2%                                           0.60%
60 to 69            16.6%                                           27.4%                                           2.2%
70 to 79            24.3%                                           43.2%                                           5.1%
80+                 27.3%                                           70.9%                                           9.3% 
</pre>

* 50% registered cases > 65yo
* young children mostly asymptomatic

* median 5.1 day incubation, 97.5% within 11.5 days.  max up to 2 weeks https://annals.org/aim/fullarticle/2762808/incubation-period-coronavirus-disease-2019-covid-19-from-publicly-reported

* virus is most contagious before symptoms show and in the first 7 days of symptoms https://www.sciencenews.org/article/coronavirus-most-contagious-before-during-first-week-symptoms 

## underlying health conditions breakdown 
https://www.theguardian.com/uk-news/2020/mar/17/the-uk-new-coronavirus-measures-in-numbers 
* Heart Disease 7.4m
* Asthma 5.4m / 200K very severe
* Autoimmune disorders 4m
* Diabetes 3.9m
* Cancer 2.9m ? (from data some will have recovered. Still at extra risk?)


## Health Service breakdown
Front line doctors / nurses / beds / ICU, PPE availability



## Key Delivery workers breakdown
Medical supplies, food etc


## Key Retail workers breakdown
Supermarkets, food, pharmacy


## Policy
* self isolation 
* social distancing
* lockdown 
* medic isolation
* virus testing
* antibody testing
* ...

## Age Demographics
https://www.ethnicity-facts-figures.service.gov.uk/uk-population-by-ethnicity/demographics/age-groups/latest#main-facts-and-figures
<pre>
Age         Percentage
0-4         6.2
5-9         5.6
10-14       5.8
15-17       3.7
18-24       9.4
25-29       6.8
30-34       6.6
35-39       6.7
40-44       7.3
45-49       7.3
50-54       6.4
55-59       5.7
60-64       6.0
65-69       4.8
70-74       3.9
75-79       3.2
80-84       2.4
85+         2.2
</pre>


# Things to model:

* population age?
* underlying population health
* population contact
* health service utilization - doctors / beds / professional's health
* health outcome
* policy changes - social distancing, total lockdown, healthcare professional isolation, key worker childcare
* public adherance to policy
* supply chain of critical items?
* changes in contagion as individual disease cases progress
