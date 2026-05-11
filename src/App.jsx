import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from "recharts";

const B={red:"#CC2027",charcoal:"#2D2D2D",dark:"#141413",white:"#FFFFFF",offWhite:"#faf9f5",cream:"#f5f3ec",lightGray:"#e8e6dc",medGray:"#b0aea5",accent:"#d97757",blue:"#6a9bcc",green:"#788c5d",success:"#2E7D4F",danger:"#CC2027",bg:"#faf9f5",card:"#FFFFFF",border:"#e0ded6",text:"#141413",muted:"#6b6960"};

// ── GE-15 Parliament constituency data ─────────────────────────────────────
// Fields: [code, state, coalition, marginPct, malay%, chinese%, indian%]
// coalition: winner's coalition at GE-15
// marginPct: winning margin as % of valid votes
// race %: share of registered voters (TindakMalaysia GE15-Dataset, Oct 2022 roll)
// Sarawak (P.192-P.222) and Sabah seats excluded from swing model (non-Malay/non-peninsular electorates)
// WP Labuan (P.166) excluded — Sabah Bumi majority
const SEATS = [
  // Perlis
  ["P.001","Perlis","PN",27.63,86.01,8.14,0.88],
  ["P.002","Perlis","PN",16.36,81.58,14.73,1.57],
  ["P.003","Perlis","PN",49.62,87.23,7.81,1.59],
  // Kedah
  ["P.004","Kedah","PN",28.47,89.65,6.75,2.38],
  ["P.005","Kedah","PN",39.18,90.75,6.78,0.11],
  ["P.006","Kedah","PN",37.87,85.99,8.72,3.38],
  ["P.007","Kedah","PN",22.54,91.66,1.30,0.14],
  ["P.008","Kedah","PN",36.10,81.32,15.24,2.48],
  ["P.009","Kedah","PN",12.90,63.18,31.76,4.26],
  ["P.010","Kedah","PN",27.93,75.96,22.25,1.18],
  ["P.011","Kedah","PN",41.39,88.47,4.75,0.50],
  ["P.012","Kedah","PN",40.33,80.43,13.03,6.01],
  ["P.013","Kedah","PN",42.59,92.50,1.46,0.14],
  ["P.014","Kedah","PN",20.50,69.06,15.30,14.41],
  ["P.015","Kedah","PH",0.86,60.99,25.75,12.45],
  ["P.016","Kedah","PN",26.72,89.24,4.27,4.63],
  ["P.017","Kedah","PN",17.79,62.18,17.75,19.36],
  ["P.018","Kedah","PN",18.57,69.73,17.19,12.53],
  // Kelantan
  ["P.019","Kelantan","PN",33.24,92.28,3.64,0.14],
  ["P.020","Kelantan","PN",49.21,96.96,1.85,0.12],
  ["P.021","Kelantan","PN",28.98,84.33,13.75,0.76],
  ["P.022","Kelantan","PN",47.15,97.29,1.96,0.06],
  ["P.023","Kelantan","PN",34.09,96.65,1.95,0.07],
  ["P.024","Kelantan","PN",50.19,97.34,2.00,0.16],
  ["P.025","Kelantan","PN",33.26,98.26,1.08,0.04],
  ["P.026","Kelantan","PN",36.76,96.60,1.91,0.08],
  ["P.027","Kelantan","PN",63.84,94.32,4.11,0.49],
  ["P.028","Kelantan","PN",35.80,98.04,0.89,0.04],
  ["P.029","Kelantan","PN",15.59,96.34,3.09,0.16],
  ["P.030","Kelantan","PN",29.02,97.72,0.18,0.12],
  ["P.031","Kelantan","PN",38.94,94.12,4.11,1.12],
  ["P.032","Kelantan","PN",0.34,78.55,5.81,0.47],
  // Terengganu
  ["P.033","Terengganu","PN",21.87,97.97,1.30,0.09],
  ["P.034","Terengganu","PN",22.43,99.23,0.28,0.04],
  ["P.035","Terengganu","PN",33.97,98.38,1.05,0.09],
  ["P.036","Terengganu","PN",42.37,90.23,8.65,0.55],
  ["P.037","Terengganu","PN",38.26,97.53,1.87,0.08],
  ["P.038","Terengganu","PN",21.85,98.82,0.43,0.04],
  ["P.039","Terengganu","PN",37.37,95.71,3.16,0.19],
  ["P.040","Terengganu","PN",24.03,93.17,5.06,0.53],
  // Pulau Pinang
  ["P.041","P. Pinang","PN",4.14,79.90,15.50,4.17],
  ["P.042","P. Pinang","PN",18.26,77.93,15.08,6.35],
  ["P.043","P. Pinang","PH",72.32,14.51,69.32,15.63],
  ["P.044","P. Pinang","PN",6.03,73.12,19.46,6.60],
  ["P.045","P. Pinang","PH",62.20,21.16,67.38,10.87],
  ["P.046","P. Pinang","PH",58.69,22.82,54.05,22.27],
  ["P.047","P. Pinang","PH",20.54,46.75,34.72,17.86],
  ["P.048","P. Pinang","PH",68.19,15.07,71.12,12.04],
  ["P.049","P. Pinang","PH",76.30,6.28,81.75,11.24],
  ["P.050","P. Pinang","PH",54.60,21.02,63.20,14.88],
  ["P.051","P. Pinang","PH",73.32,14.64,71.69,12.83],
  ["P.052","P. Pinang","PH",38.91,38.77,47.85,12.18],
  ["P.053","P. Pinang","PH",2.48,65.23,29.05,4.83],
  // Perak
  ["P.054","Perak","PN",3.98,66.84,13.51,3.03],
  ["P.055","Perak","BN",3.18,83.21,11.80,1.38],
  ["P.056","Perak","PN",22.36,89.94,3.92,5.62],
  ["P.057","Perak","PN",10.20,68.43,25.88,5.10],
  ["P.058","Perak","PN",29.67,78.25,12.36,9.01],
  ["P.059","Perak","PN",17.82,71.25,19.14,9.04],
  ["P.060","Perak","PH",30.12,39.67,44.38,14.45],
  ["P.061","Perak","PN",10.19,77.87,14.82,6.75],
  ["P.062","Perak","PH",3.57,34.20,34.67,21.13],
  ["P.063","Perak","PH",2.98,64.63,20.49,12.48],
  ["P.064","Perak","PH",55.01,23.08,68.41,7.49],
  ["P.065","Perak","PH",72.32,13.15,59.11,26.96],
  ["P.066","Perak","PH",71.82,12.65,69.09,17.59],
  ["P.067","Perak","PN",9.97,70.35,21.02,6.57],
  ["P.068","Perak","PH",47.07,27.13,56.81,15.17],
  ["P.069","Perak","PN",5.74,92.34,2.00,2.52],
  ["P.070","Perak","PH",24.13,34.58,52.64,10.12],
  ["P.071","Perak","PH",26.20,42.69,44.76,9.63],
  ["P.072","Perak","BN",11.38,45.53,24.48,13.90],
  ["P.073","Perak","PN",8.77,80.97,12.21,3.26],
  ["P.074","Perak","PN",0.51,72.20,14.13,11.36],
  ["P.075","Perak","BN",0.83,56.44,20.44,21.60],
  ["P.076","Perak","PH",23.63,41.88,38.36,18.69],
  ["P.077","Perak","PH",5.08,54.96,23.65,13.00],
  // Pahang
  ["P.078","Pahang","BN",13.66,30.97,27.15,12.19],
  ["P.079","Pahang","BN",17.06,78.23,14.76,4.99],
  ["P.080","Pahang","PH",7.75,52.06,36.59,6.19],
  ["P.081","Pahang","PN",12.12,82.20,11.77,2.45],
  ["P.082","Pahang","PN",9.00,67.34,25.48,5.58],
  ["P.083","Pahang","PN",4.23,69.03,26.30,3.22],
  ["P.084","Pahang","BN",2.12,83.96,11.06,1.92],
  ["P.085","Pahang","BN",9.62,84.96,1.79,0.70],
  ["P.086","Pahang","PN",4.43,89.36,5.80,1.38],
  ["P.087","Pahang","PN",2.14,88.70,2.52,2.07],
  ["P.088","Pahang","PN",6.68,66.28,21.05,8.12],
  ["P.089","Pahang","PH",1.04,49.25,37.99,9.09],
  ["P.090","Pahang","BN",28.04,62.04,27.82,3.66],
  ["P.091","Pahang","PN",2.15,83.29,2.43,0.89],
  // Selangor
  ["P.092","Selangor","PN",12.34,81.32,13.05,4.88],
  ["P.093","Selangor","PN",5.33,67.33,29.33,2.10],
  ["P.094","Selangor","PN",1.28,62.81,18.14,15.13],
  ["P.095","Selangor","PN",4.26,73.15,17.20,8.23],
  ["P.096","Selangor","PH",1.16,66.81,12.06,19.55],
  ["P.097","Selangor","PH",16.30,51.59,26.30,17.90],
  ["P.098","Selangor","PH",7.69,69.94,10.86,10.86],
  ["P.099","Selangor","PH",28.42,51.40,32.44,9.68],
  ["P.100","Selangor","PH",41.76,40.22,46.97,7.95],
  ["P.101","Selangor","PH",10.88,63.45,20.97,10.72],
  ["P.102","Selangor","PH",28.53,48.43,36.96,11.19],
  ["P.103","Selangor","PH",47.92,37.26,49.40,10.95],
  ["P.104","Selangor","PH",64.65,26.25,54.04,16.81],
  ["P.105","Selangor","PH",34.67,46.15,29.56,20.73],
  ["P.106","Selangor","PH",71.24,20.66,66.14,9.98],
  ["P.107","Selangor","PH",2.08,62.62,20.70,10.44],
  ["P.108","Selangor","PH",13.33,73.36,12.67,11.92],
  ["P.109","Selangor","PN",7.46,68.00,15.26,14.21],
  ["P.110","Selangor","PH",56.01,26.65,52.77,18.25],
  ["P.111","Selangor","PH",37.42,39.81,29.68,27.34],
  ["P.112","Selangor","PN",1.48,54.86,23.76,17.28],
  ["P.113","Selangor","PH",6.49,62.92,19.15,13.14],
  // WP KL
  ["P.114","WP KL","PH",84.46,5.62,85.51,7.08],
  ["P.115","WP KL","PH",25.52,44.05,34.57,18.18],
  ["P.116","WP KL","PH",22.32,57.71,28.51,9.11],
  ["P.117","WP KL","PH",69.81,26.77,56.76,11.81],
  ["P.118","WP KL","PH",16.27,60.52,24.51,11.69],
  ["P.119","WP KL","BN",7.61,66.43,16.50,9.31],
  ["P.120","WP KL","PH",73.63,13.05,71.60,12.41],
  ["P.121","WP KL","PH",18.13,59.09,19.14,17.18],
  ["P.122","WP KL","PH",76.83,12.06,76.78,8.96],
  ["P.123","WP KL","PH",75.89,13.44,77.09,7.77],
  ["P.124","WP KL","PH",10.55,61.99,26.94,8.77],
  // WP Putrajaya
  ["P.125","WP Putrajaya","PN",6.30,93.85,0.89,2.78],
  // N. Sembilan
  ["P.126","N. Sembilan","BN",17.92,65.12,23.33,5.49],
  ["P.127","N. Sembilan","BN",8.16,63.63,22.01,12.74],
  ["P.128","N. Sembilan","PH",25.02,51.29,31.90,13.93],
  ["P.129","N. Sembilan","BN",13.32,76.03,15.68,5.25],
  ["P.130","N. Sembilan","PH",51.79,32.57,42.64,22.38],
  ["P.131","N. Sembilan","BN",18.18,73.49,8.86,15.94],
  ["P.132","N. Sembilan","PH",29.85,43.60,31.87,21.41],
  ["P.133","N. Sembilan","BN",2.09,61.93,23.66,12.28],
  // Melaka
  ["P.134","Melaka","PN",8.06,81.95,11.74,3.64],
  ["P.135","Melaka","PH",1.22,61.39,23.78,13.07],
  ["P.136","Melaka","PN",9.62,69.28,22.29,3.65],
  ["P.137","Melaka","PH",9.14,61.73,30.62,6.04],
  ["P.138","Melaka","PH",37.68,38.98,54.17,4.46],
  ["P.139","Melaka","PN",0.41,73.29,15.50,10.12],
  // Johor
  ["P.140","Johor","PH",11.19,46.70,42.64,9.32],
  ["P.141","Johor","PH",3.59,57.76,36.58,4.07],
  ["P.142","Johor","PH",8.15,37.55,43.75,15.36],
  ["P.143","Johor","PN",18.40,66.08,29.25,3.42],
  ["P.144","Johor","PH",12.16,55.29,38.55,4.89],
  ["P.145","Johor","PH",26.32,45.39,51.62,2.12],
  ["P.146","Johor","ALONE",2.53,66.35,31.25,1.34],
  ["P.147","Johor","BN",3.21,80.21,18.07,0.47],
  ["P.148","Johor","BN",6.35,57.61,37.09,4.14],
  ["P.149","Johor","PH",6.53,63.69,33.83,1.37],
  ["P.150","Johor","PH",16.05,52.03,44.72,1.43],
  ["P.151","Johor","BN",4.13,60.53,28.69,8.63],
  ["P.152","Johor","PH",27.62,41.23,46.06,10.43],
  ["P.153","Johor","BN",26.58,60.25,27.81,8.80],
  ["P.154","Johor","PN",4.98,81.18,13.74,1.18],
  ["P.155","Johor","BN",5.82,72.99,16.36,7.04],
  ["P.156","Johor","BN",17.73,88.67,7.96,1.78],
  ["P.157","Johor","BN",11.97,89.38,8.06,0.75],
  ["P.158","Johor","PH",18.29,44.96,38.77,11.44],
  ["P.159","Johor","PH",21.14,46.13,36.17,10.21],
  ["P.160","Johor","PH",16.99,51.42,39.23,5.90],
  ["P.161","Johor","PH",28.28,44.61,40.12,12.22],
  ["P.162","Johor","PH",36.68,36.27,47.22,14.10],
  ["P.163","Johor","PH",31.26,36.96,49.21,11.58],
  ["P.164","Johor","BN",10.13,68.25,28.03,1.06],
  ["P.165","Johor","BN",11.65,57.02,40.05,1.02],
  // Sabah (GRS/BN/PH — outside Malay swing model, kept as static)
  ["P.167","Sabah","ALONE",4.36,4.17,7.06,0.12],
  ["P.168","Sabah","ALONE",16.37,2.66,2.01,0.08],
  ["P.169","Sabah","ALONE",8.48,2.92,1.12,0.20],
  ["P.170","Sabah","PH",0.40,4.76,4.24,0.23],
  ["P.171","Sabah","PH",10.02,12.97,17.07,0.54],
  ["P.172","Sabah","PH",53.91,4.21,59.90,0.98],
  ["P.173","Sabah","BN",0.30,18.66,11.76,0.74],
  ["P.174","Sabah","PH",28.41,4.72,26.71,0.68],
  ["P.175","Sabah","GRS",28.10,8.92,6.29,0.30],
  ["P.176","Sabah","BN",9.78,9.22,2.93,0.18],
  ["P.177","Sabah","BN",8.59,7.21,5.44,0.32],
  ["P.178","Sabah","GRS",16.14,8.07,3.38,0.17],
  ["P.179","Sabah","GRS",26.22,2.20,1.32,0.08],
  ["P.180","Sabah","GRS",14.68,5.36,7.08,0.16],
  ["P.181","Sabah","ALONE",3.87,6.09,8.50,0.08],
  ["P.182","Sabah","BN",14.58,1.51,0.94,0.05],
  ["P.183","Sabah","PN",5.43,5.47,0.86,0.11],
  ["P.184","Sabah","BN",28.34,28.03,15.12,0.31],
  ["P.185","Sabah","GRS",17.83,14.83,26.98,0.31],
  ["P.186","Sabah","PH",35.68,14.39,42.37,0.64],
  ["P.187","Sabah","BN",14.75,14.61,0.68,0.14],
  ["P.188","Sabah","ALONE",7.53,26.42,9.14,0.42],
  ["P.189","Sabah","ALONE",53.48,6.60,1.52,0.14],
  ["P.190","Sabah","GRS",7.50,33.96,29.52,0.38],
  ["P.191","Sabah","BN",18.19,49.17,8.37,0.36],
  // Sarawak — GPS held, outside swing model entirely
  ["P.192","Sarawak","PH",17.46,5.14,17.08,0.18],
  ["P.193","Sarawak","GPS",74.66,78.03,7.92,0.09],
  ["P.194","Sarawak","GPS",59.81,69.37,13.41,0.59],
  ["P.195","Sarawak","PH",45.44,4.53,85.26,0.70],
  ["P.196","Sarawak","PH",9.71,14.56,61.57,0.68],
  ["P.197","Sarawak","GPS",53.43,55.76,13.26,0.24],
  ["P.198","Sarawak","GPS",26.07,4.80,24.91,0.18],
  ["P.199","Sarawak","GPS",41.77,7.60,10.21,0.17],
  ["P.200","Sarawak","GPS",66.36,69.99,5.19,0.05],
  ["P.201","Sarawak","GPS",52.48,70.74,2.70,0.02],
  ["P.202","Sarawak","GPS",12.65,10.31,16.81,0.06],
  ["P.203","Sarawak","GPS",0.52,1.73,7.95,0.05],
  ["P.204","Sarawak","GPS",42.31,43.65,6.37,0.03],
  ["P.205","Sarawak","PN",28.62,36.90,6.64,0.03],
  ["P.206","Sarawak","GPS",73.05,23.26,6.06,0.05],
  ["P.207","Sarawak","GPS",86.32,5.96,3.83,0.02],
  ["P.208","Sarawak","GPS",10.14,4.56,60.65,0.03],
  ["P.209","Sarawak","ALONE",5.95,0.48,4.98,0.02],
  ["P.210","Sarawak","GPS",1.31,1.74,11.53,0.02],
  ["P.211","Sarawak","PH",21.80,4.23,64.96,0.05],
  ["P.212","Sarawak","PH",11.77,10.40,62.03,0.12],
  ["P.213","Sarawak","GPS",56.47,3.29,9.89,0.05],
  ["P.214","Sarawak","GPS",17.31,1.01,3.78,0.02],
  ["P.215","Sarawak","GPS",56.38,2.37,8.71,0.04],
  ["P.216","Sarawak","GPS",32.06,0.98,1.81,0.03],
  ["P.217","Sarawak","GPS",31.49,9.81,25.24,0.10],
  ["P.218","Sarawak","GPS",34.63,18.39,22.84,0.17],
  ["P.219","Sarawak","PH",7.88,16.78,46.38,0.32],
  ["P.220","Sarawak","GPS",24.64,4.52,7.44,0.04],
  ["P.221","Sarawak","GPS",50.51,25.82,17.48,0.10],
  ["P.222","Sarawak","GPS",31.18,35.90,9.42,0.12],
];

// Seats where swing model applies (peninsular + WP, not Sabah/Sarawak)
const SWING_STATES = new Set(["Perlis","Kedah","Kelantan","Terengganu","P. Pinang","Perak","Pahang","Selangor","WP KL","WP Putrajaya","N. Sembilan","Melaka","Johor"]);

// DUN static data (state-level, unchanged from original model)
const DUN = {"10":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":266,"PH":111,"BN":76,"ALONE":36,"GRS":29},"gainer":{"co":"PN","d":57},"loser":{"co":"BN","d":-36},"states":{"Perlis":{"t":15,"o":14,"f":0,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":2,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":10,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":11,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":8,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":13,"m":19,"g":false},"Melaka":{"t":28,"o":2,"f":4,"m":15,"g":false},"Johor":{"t":56,"o":3,"f":4,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":1,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":7},"15":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":297,"PH":102,"BN":57,"ALONE":36,"GRS":26},"gainer":{"co":"PN","d":88},"loser":{"co":"BN","d":-55},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":10,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":13,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":14,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":14,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":13,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":11,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":4,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":9},"20":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":324,"PH":95,"BN":41,"ALONE":33,"GRS":25},"gainer":{"co":"PN","d":115},"loser":{"co":"BN","d":-71},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":12,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":16,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":17,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":17,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":16,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":19,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":9,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":9},"25":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":353,"PH":88,"BN":27,"ALONE":29,"GRS":21},"gainer":{"co":"PN","d":144},"loser":{"co":"BN","d":-85},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":3,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":14,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":19,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":17,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":19,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":17,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":30,"m":29,"g":true},"Sabah":{"t":73,"o":1,"f":18,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":10},"30":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":387,"PH":80,"BN":16,"GRS":15,"ALONE":20},"gainer":{"co":"PN","d":178},"loser":{"co":"BN","d":-96},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":3,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":15,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":21,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":18,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":22,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":19,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":38,"m":29,"g":true},"Sabah":{"t":73,"o":1,"f":35,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":10}};

// ── Swing model ─────────────────────────────────────────────────────────────
// Positive swing = votes shift TO PN; negative = votes shift AWAY from PN
// For a non-PN winner: combined swing against winner = sum(swingToPN_race * race%)
// A seat flips to PN when netSwingAgainstWinner > marginPct/2
// For a PN seat that already won: it can flip away if swing is negative
function computeResults(malaySwing, chineseSwing, indianSwing) {
  const base = { PN: 0, PH: 0, BN: 0, GPS: 0, GRS: 0, ALONE: 0 };
  const flippedToPN = [];
  const flippedFromPN = [];

  for (const [code, state, coalition, marginPct, mPct, cPct, iPct] of SEATS) {
    const isSwingState = SWING_STATES.has(state);
    base[coalition] = (base[coalition] || 0) + 1;

    if (!isSwingState) continue; // Sabah/Sarawak: no swing applied

    // Net vote swing toward PN (as % of total valid votes)
    // Each race contributes: swing% * race_share_of_voters / 100
    const netToPN = (malaySwing * mPct + chineseSwing * cPct + indianSwing * iPct) / 100;

    if (coalition !== "PN") {
      // Does PN gain this seat? netToPN must exceed half the margin
      if (netToPN > marginPct / 2) {
        flippedToPN.push(code);
      }
    } else {
      // Does PN lose this seat? net swing away from PN must exceed half the margin
      if (-netToPN > marginPct / 2) {
        flippedFromPN.push(code);
      }
    }
  }
  return { base, flippedToPN, flippedFromPN };
}

// ── Sub-components ───────────────────────────────────────────────────────────
const SeatBar = ({ pn, total, maj, flips }) => (
  <div style={{ height: 14, background: B.lightGray, borderRadius: 2, overflow: "hidden", position: "relative" }}>
    <div style={{ height: "100%", width: `${(pn - flips) / total * 100}%`, background: B.red, position: "absolute", left: 0 }} />
    <div style={{ height: "100%", width: `${flips / total * 100}%`, background: B.accent, position: "absolute", left: `${(pn - flips) / total * 100}%` }} />
    <div style={{ position: "absolute", left: `${maj / total * 100}%`, top: 0, bottom: 0, width: 2, background: B.dark, zIndex: 2 }} />
  </div>
);

const CoRow = ({ co, pre, post, isG, isL }) => {
  const d = post - pre;
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${B.lightGray}`, background: isG ? "rgba(120,140,93,0.08)" : isL ? "rgba(204,32,39,0.05)" : "transparent" }}>
      <span style={{ width: 45, fontSize: 11, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>{co}</span>
      {(isG || isL) && <span style={{ fontSize: 7, background: isG ? B.green : B.danger, color: B.white, padding: "1px 5px", borderRadius: 6, fontWeight: 700, marginRight: 4 }}>{isG ? "▲ GAINER" : "▼ LOSER"}</span>}
      <span style={{ flex: 1 }} />
      <span style={{ fontSize: 10, color: B.muted, width: 30, textAlign: "center" }}>{pre}</span>
      <span style={{ fontSize: 10, color: B.muted, margin: "0 4px" }}>→</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: d > 0 ? B.success : d < 0 ? B.danger : B.muted, width: 30, textAlign: "center" }}>{post}</span>
      <span style={{ fontSize: 10, width: 40, textAlign: "right", color: d > 0 ? B.success : d < 0 ? B.danger : B.muted, fontWeight: 600 }}>{d > 0 ? `+${d}` : d}</span>
    </div>
  );
};

const RaceSlider = ({ label, value, onChange, color }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Poppins',sans-serif", color }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "'Poppins',sans-serif", color: value > 0 ? B.success : value < 0 ? B.danger : B.muted, minWidth: 42, textAlign: "right" }}>
        {value > 0 ? `+${value}%` : `${value}%`}
      </span>
    </div>
    <div style={{ position: "relative", height: 28, display: "flex", alignItems: "center" }}>
      {/* centre marker */}
      <div style={{ position: "absolute", left: "50%", top: 4, bottom: 4, width: 1, background: B.medGray, zIndex: 1 }} />
      <input
        type="range" min={-30} max={30} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, cursor: "pointer", position: "relative", zIndex: 2 }}
      />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 7, color: B.muted, fontFamily: "'Poppins',sans-serif", marginTop: -2 }}>
      <span>−30%</span><span style={{ color: B.muted }}>0</span><span>+30%</span>
    </div>
  </div>
);

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("parliament");
  const [dunSwing, setDunSwing] = useState("15");
  const [malaySwing, setMalaySwing] = useState(15);
  const [chineseSwing, setChineseSwing] = useState(0);
  const [indianSwing, setIndianSwing] = useState(0);

  // ── Live parliament computation ─────────────────────────────────────────
  const { base, flippedToPN, flippedFromPN } = useMemo(
    () => computeResults(malaySwing, chineseSwing, indianSwing),
    [malaySwing, chineseSwing, indianSwing]
  );

  // Seat codes for quick lookup
  const flippedToPNSet = new Set(flippedToPN);
  const flippedFromPNSet = new Set(flippedFromPN);

  // Count post-swing seats per coalition (peninsular swing model only)
  const post = { ...base };
  for (const code of flippedToPN) {
    const seat = SEATS.find(s => s[0] === code);
    if (seat) { post[seat[2]]--; post.PN++; }
  }
  for (const code of flippedFromPN) {
    // Determine who gains — simplification: flipped PN seats go to their pre-GE15 holder
    // For UI purposes we just subtract from PN and add to PH (most likely gainer)
    post.PN--; post.PH++;
  }

  const pnTotal = post.PN;
  const hasMaj = pnTotal >= 112;
  const pnFlip = flippedToPN.length;
  const pnLost = flippedFromPN.length;

  // Gainer / loser across all coalitions
  const coalitions = ["PN", "PH", "BN", "GPS", "GRS", "ALONE"];
  let gainerCo = "PN", gainerD = 0, loserCo = "PH", loserD = 0;
  for (const co of coalitions) {
    const d = (post[co] || 0) - (base[co] || 0);
    if (d > gainerD) { gainerD = d; gainerCo = co; }
    if (d < loserD) { loserD = d; loserCo = co; }
  }

  // State-level parliament chart
  const stateFlips = {};
  const stateHeld = {};
  const stateOther = {};
  const stateTotal = {};
  for (const [code, state, coalition, , , ,] of SEATS) {
    if (!SWING_STATES.has(state)) continue;
    stateTotal[state] = (stateTotal[state] || 0) + 1;
    if (coalition === "PN" && !flippedFromPNSet.has(code)) {
      stateHeld[state] = (stateHeld[state] || 0) + 1;
    } else if (flippedToPNSet.has(code)) {
      stateFlips[state] = (stateFlips[state] || 0) + 1;
    } else {
      stateOther[state] = (stateOther[state] || 0) + 1;
    }
  }
  const parlChart = Object.keys(stateTotal)
    .map(st => ({ name: st.replace("WP KL","KL").replace("WP Putrajaya","Putrajaya").replace("N. Sembilan","N.Semb").replace("P. Pinang","P.Pinang"), orig: stateHeld[st]||0, flip: stateFlips[st]||0, other: stateOther[st]||0 }))
    .filter(d => (d.orig + d.flip) > 0)
    .sort((a, b) => (b.orig + b.flip) - (a.orig + a.flip));

  // DUN tab data
  const dn = DUN[dunSwing];
  const dunChart = Object.entries(dn.states).map(([st, v]) => ({
    name: st.replace("P. Pinang", "P.Pinang").replace("N. Sembilan", "N.Semb"),
    orig: v.o, flip: v.f, total: v.t, maj: v.m, other: v.t - v.o - v.f, fg: v.g, gps: !!v.gps
  })).sort((a, b) => a.gps - b.gps || (b.orig + b.flip) / b.total - (a.orig + a.flip) / a.total);

  return (
    <div style={{ fontFamily: "'Lora',Georgia,serif", background: B.bg, color: B.text, minHeight: "100vh", padding: "16px 14px" }}>
      {/* Header */}
      <div style={{ borderBottom: `3px solid ${B.red}`, paddingBottom: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 20, height: 20, background: B.red, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: B.white, fontSize: 12, fontWeight: 900, fontFamily: "sans-serif" }}>▲</span>
          </div>
          <span style={{ fontSize: 8, letterSpacing: 3, color: B.red, textTransform: "uppercase", fontFamily: "'Poppins',sans-serif", fontWeight: 700 }}>Scenario Analysis</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 400, margin: "0 0 3px", color: B.charcoal }}>Malaysia GE-15 — Multi-Race Swing Model</h1>
        <p style={{ fontSize: 9, color: B.muted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Race-weighted constituency model · TindakMalaysia GE-15 voter roll · MECo (CC0)</p>
      </div>

      {/* ── Race sliders ── */}
      <div style={{ background: B.card, border: `1px solid ${B.border}`, borderTop: `3px solid ${B.charcoal}`, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ fontSize: 11, margin: 0, fontFamily: "'Poppins',sans-serif", fontWeight: 700 }}>Vote Swing to PN by Race</h3>
          <button onClick={() => { setMalaySwing(0); setChineseSwing(0); setIndianSwing(0); }}
            style={{ fontSize: 8, padding: "2px 8px", background: "transparent", border: `1px solid ${B.border}`, borderRadius: 4, cursor: "pointer", fontFamily: "'Poppins',sans-serif", color: B.muted }}>
            Reset
          </button>
        </div>
        <RaceSlider label="Malay" value={malaySwing} onChange={setMalaySwing} color={B.red} />
        <RaceSlider label="Chinese" value={chineseSwing} onChange={setChineseSwing} color={B.blue} />
        <RaceSlider label="Indian" value={indianSwing} onChange={setIndianSwing} color={B.green} />
        <div style={{ fontSize: 8, color: B.muted, fontFamily: "'Poppins',sans-serif", lineHeight: 1.5, marginTop: 4, borderTop: `1px solid ${B.lightGray}`, paddingTop: 6 }}>
          Positive = swing toward PN · Negative = swing away from PN · Model: winner vote share × race % of electorate per constituency
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
        {[
          { val: pnTotal, l: "PN Seats", s: hasMaj ? "✓ MAJORITY" : `${112 - pnTotal} short`, c: hasMaj ? B.success : B.accent },
          { val: `+${pnFlip}`, l: "Flipped", s: "to PN", c: B.accent },
          { val: pnLost > 0 ? `-${pnLost}` : "0", l: "Lost", s: "from PN", c: pnLost > 0 ? B.danger : B.muted },
          { val: loserD, l: loserCo, s: "biggest loser", c: B.danger },
        ].map((m, i) => (
          <div key={i} style={{ background: B.card, border: `1px solid ${B.border}`, borderTop: `3px solid ${m.c}`, padding: "10px 4px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 400, color: m.c }}>{m.val}</div>
            <div style={{ fontSize: 8, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>{m.l}</div>
            <div style={{ fontSize: 7, color: B.muted, fontFamily: "'Poppins',sans-serif" }}>{m.s}</div>
          </div>
        ))}
      </div>

      {/* Gainer / Loser */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
        <div style={{ background: "rgba(120,140,93,0.1)", border: `1px solid ${B.green}`, borderLeft: `4px solid ${B.green}`, padding: "8px 10px" }}>
          <div style={{ fontSize: 7, color: B.green, fontWeight: 700, fontFamily: "'Poppins',sans-serif", letterSpacing: 1 }}>▲ BIGGEST GAINER</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.success, fontFamily: "'Poppins',sans-serif" }}>{gainerCo} <span style={{ fontSize: 11 }}>+{gainerD}</span></div>
        </div>
        <div style={{ background: "rgba(204,32,39,0.06)", border: `1px solid ${B.danger}`, borderLeft: `4px solid ${B.danger}`, padding: "8px 10px" }}>
          <div style={{ fontSize: 7, color: B.danger, fontWeight: 700, fontFamily: "'Poppins',sans-serif", letterSpacing: 1 }}>▼ BIGGEST LOSER</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.danger, fontFamily: "'Poppins',sans-serif" }}>{loserCo} <span style={{ fontSize: 11 }}>{loserD}</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 12, borderBottom: `2px solid ${B.lightGray}` }}>
        {[{ k: "parliament", l: "Parliament" }, { k: "states", l: "State DUN" }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ padding: "7px 12px", background: "transparent", color: tab === t.k ? B.red : B.muted, border: "none", borderBottom: tab === t.k ? `3px solid ${B.red}` : "3px solid transparent", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "'Poppins',sans-serif", textTransform: "uppercase", letterSpacing: 1, marginBottom: -2 }}>{t.l}</button>
        ))}
      </div>

      {tab === "parliament" ? (
        <div>
          {/* Seat bar */}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600 }}>PN {pnTotal}/222</span>
              <span style={{ fontSize: 10, color: hasMaj ? B.success : B.accent, fontWeight: 700 }}>{hasMaj ? "✓ MAJORITY" : `Need ${112 - pnTotal} more`}</span>
            </div>
            <SeatBar pn={pnTotal} total={222} maj={112} flips={pnFlip} />
            <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: 8, color: B.muted, fontFamily: "'Poppins',sans-serif" }}>
              <span><span style={{ display: "inline-block", width: 7, height: 7, background: B.red, marginRight: 2 }} />Held</span>
              <span><span style={{ display: "inline-block", width: 7, height: 7, background: B.accent, marginRight: 2 }} />Gained</span>
              <span><span style={{ display: "inline-block", width: 7, height: 2, background: B.dark, marginRight: 2, verticalAlign: "middle" }} />Majority</span>
            </div>
          </div>

          {/* Coalition changes */}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, padding: 14, marginBottom: 10 }}>
            <h3 style={{ fontSize: 11, margin: "0 0 6px", fontFamily: "'Poppins',sans-serif", fontWeight: 700 }}>Coalition Seat Changes</h3>
            {coalitions.map(co => <CoRow key={co} co={co} pre={base[co] || 0} post={post[co] || 0} isG={co === gainerCo} isL={co === loserCo} />)}
          </div>

          {/* State chart */}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, padding: 14 }}>
            <h3 style={{ fontSize: 11, margin: "0 0 8px", fontFamily: "'Poppins',sans-serif", fontWeight: 700 }}>PN Gains by State (Peninsular + WP)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={parlChart} layout="vertical" margin={{ left: 70, right: 8, top: 2, bottom: 2 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
                <XAxis type="number" tick={{ fill: B.muted, fontSize: 8 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: B.text, fontSize: 8 }} width={66} />
                <Tooltip contentStyle={{ background: B.card, border: `1px solid ${B.border}`, fontSize: 9 }} formatter={(v, n) => [v, n === "orig" ? "PN Held" : n === "flip" ? "Gained" : "Others"]} />
                <Bar dataKey="orig" stackId="a" fill={B.red} />
                <Bar dataKey="flip" stackId="a" fill={B.accent} />
                <Bar dataKey="other" stackId="a" fill={B.lightGray} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div>
          {/* DUN uses original static model — driven by Malay swing only */}
          <div style={{ background: B.cream, border: `1px solid ${B.border}`, borderLeft: `3px solid ${B.accent}`, padding: "8px 12px", marginBottom: 10, fontSize: 9, fontFamily: "'Poppins',sans-serif", lineHeight: 1.5 }}>
            State DUN uses the original Malay-swing model (race-disaggregated DUN data not yet available). Select a swing level:
          </div>
          <div style={{ display: "flex", gap: 0, marginBottom: 12, borderRadius: 4, overflow: "hidden", border: `2px solid ${B.red}` }}>
            {["10", "15", "20", "25", "30"].map(s => (
              <button key={s} onClick={() => setDunSwing(s)} style={{ flex: 1, padding: "8px 0", background: dunSwing === s ? B.red : "transparent", color: dunSwing === s ? B.white : B.text, border: "none", cursor: "pointer", fontSize: 12, fontWeight: dunSwing === s ? 800 : 400, fontFamily: "'Poppins',sans-serif" }}>
                {s}%
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
            <div style={{ background: "rgba(120,140,93,0.1)", border: `1px solid ${B.green}`, padding: "7px 10px" }}>
              <div style={{ fontSize: 7, color: B.green, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>▲ DUN GAINER</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: B.success, fontFamily: "'Poppins',sans-serif" }}>{dn.gainer.co} +{dn.gainer.d}</div>
            </div>
            <div style={{ background: "rgba(204,32,39,0.06)", border: `1px solid ${B.danger}`, padding: "7px 10px" }}>
              <div style={{ fontSize: 7, color: B.danger, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>▼ DUN LOSER</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: B.danger, fontFamily: "'Poppins',sans-serif" }}>{dn.loser.co} {dn.loser.d}</div>
            </div>
          </div>

          <div style={{ background: B.card, border: `1px solid ${B.border}`, padding: 14, marginBottom: 10 }}>
            <h3 style={{ fontSize: 11, margin: "0 0 6px", fontFamily: "'Poppins',sans-serif", fontWeight: 700 }}>DUN Coalition Changes (518 seats)</h3>
            {["PN", "PH", "BN", "ALONE", "GRS"].map(co => <CoRow key={co} co={co} pre={dn.pre[co] || 0} post={dn.post[co] || 0} isG={co === dn.gainer.co} isL={co === dn.loser.co} />)}
          </div>

          <div style={{ background: B.card, border: `1px solid ${B.border}`, padding: 14 }}>
            <h3 style={{ fontSize: 11, margin: "0 0 8px", fontFamily: "'Poppins',sans-serif", fontWeight: 700 }}>State Assemblies</h3>
            <div style={{ display: "grid", gap: 5 }}>
              {dunChart.map(d => {
                const pnN = d.orig + d.flip;
                return d.gps ? (
                  <div key={d.name} style={{ background: "rgba(106,155,204,0.06)", padding: 8, border: `1px solid ${B.blue}`, borderLeft: `3px solid ${B.blue}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>{d.name}</span>
                      <span style={{ fontSize: 8, color: B.blue, fontWeight: 700, fontFamily: "'Poppins',sans-serif", background: "rgba(106,155,204,0.15)", padding: "1px 6px", borderRadius: 4 }}>GPS · 82 seats</span>
                    </div>
                    <div style={{ fontSize: 8, color: B.muted, fontFamily: "'Poppins',sans-serif", fontStyle: "italic" }}>Outside swing model — GPS-held, non-Malay majority electorate</div>
                  </div>
                ) : (
                  <div key={d.name} style={{ background: B.offWhite, padding: 8, border: `1px solid ${d.fg ? B.success : B.border}`, borderLeft: `3px solid ${d.fg ? B.success : B.lightGray}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>{d.name}</span>
                      <span style={{ fontSize: 8, color: d.fg ? B.success : B.danger, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>{d.fg ? "✓ PN" : "✗"} {pnN}/{d.total}</span>
                    </div>
                    <SeatBar pn={pnN} total={d.total} maj={d.maj} flips={d.flip} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 12, padding: 6, fontSize: 7, color: B.muted, borderTop: `1px solid ${B.border}`, fontFamily: "'Poppins',sans-serif", lineHeight: 1.5 }}>
        TindakMalaysia GE-15 voter roll (Oct 2022) · MECo (CC0) · DOSM Census 2020 · Constituency-level race-weighted model · Hypothetical
      </div>
    </div>
  );
}
