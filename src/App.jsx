import { useState, useMemo } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, RotateCcw, CheckIcon, AlertTriangle } from "lucide-react";

// ── GE-15 Parliament constituency data ──────────────────────────────────────
// [code, state, coalition, party, marginPct, malay%, chinese%, indian%]
const SEATS = [
  ["P.001","Perlis","PN","Bersatu",27.63,86.01,8.14,0.88],
  ["P.002","Perlis","PN","PAS",16.36,81.58,14.73,1.57],
  ["P.003","Perlis","PN","Bersatu",49.62,87.23,7.81,1.59],
  ["P.004","Kedah","PN","PAS",28.47,89.65,6.75,2.38],
  ["P.005","Kedah","PN","PAS",39.18,90.75,6.78,0.11],
  ["P.006","Kedah","PN","Bersatu",37.87,85.99,8.72,3.38],
  ["P.007","Kedah","PN","PAS",22.54,91.66,1.30,0.14],
  ["P.008","Kedah","PN","PAS",36.10,81.32,15.24,2.48],
  ["P.009","Kedah","PN","PAS",12.90,63.18,31.76,4.26],
  ["P.010","Kedah","PN","Bersatu",27.93,75.96,22.25,1.18],
  ["P.011","Kedah","PN","PAS",41.39,88.47,4.75,0.50],
  ["P.012","Kedah","PN","Bersatu",40.33,80.43,13.03,6.01],
  ["P.013","Kedah","PN","PAS",42.59,92.50,1.46,0.14],
  ["P.014","Kedah","PN","PAS",20.50,69.06,15.30,14.41],
  ["P.015","Kedah","PH","PKR",0.86,60.99,25.75,12.45],
  ["P.016","Kedah","PN","Bersatu",26.72,89.24,4.27,4.63],
  ["P.017","Kedah","PN","PAS",17.79,62.18,17.75,19.36],
  ["P.018","Kedah","PN","Bersatu",18.57,69.73,17.19,12.53],
  ["P.019","Kelantan","PN","PAS",33.24,92.28,3.64,0.14],
  ["P.020","Kelantan","PN","PAS",49.21,96.96,1.85,0.12],
  ["P.021","Kelantan","PN","PAS",28.98,84.33,13.75,0.76],
  ["P.022","Kelantan","PN","PAS",47.15,97.29,1.96,0.06],
  ["P.023","Kelantan","PN","PAS",34.09,96.65,1.95,0.07],
  ["P.024","Kelantan","PN","PAS",50.19,97.34,2.00,0.16],
  ["P.025","Kelantan","PN","PAS",33.26,98.26,1.08,0.04],
  ["P.026","Kelantan","PN","PAS",36.76,96.60,1.91,0.08],
  ["P.027","Kelantan","PN","PAS",63.84,94.32,4.11,0.49],
  ["P.028","Kelantan","PN","PAS",35.80,98.04,0.89,0.04],
  ["P.029","Kelantan","PN","PAS",15.59,96.34,3.09,0.16],
  ["P.030","Kelantan","PN","PAS",29.02,97.72,0.18,0.12],
  ["P.031","Kelantan","PN","PAS",38.94,94.12,4.11,1.12],
  ["P.032","Kelantan","PN","Bersatu",0.34,78.55,5.81,0.47],
  ["P.033","Terengganu","PN","PAS",21.87,97.97,1.30,0.09],
  ["P.034","Terengganu","PN","PAS",22.43,99.23,0.28,0.04],
  ["P.035","Terengganu","PN","PAS",33.97,98.38,1.05,0.09],
  ["P.036","Terengganu","PN","Bersatu",42.37,90.23,8.65,0.55],
  ["P.037","Terengganu","PN","PAS",38.26,97.53,1.87,0.08],
  ["P.038","Terengganu","PN","PAS",21.85,98.82,0.43,0.04],
  ["P.039","Terengganu","PN","PAS",37.37,95.71,3.16,0.19],
  ["P.040","Terengganu","PN","Bersatu",24.03,93.17,5.06,0.53],
  ["P.041","P. Pinang","PN","Bersatu",4.14,79.90,15.50,4.17],
  ["P.042","P. Pinang","PN","Bersatu",18.26,77.93,15.08,6.35],
  ["P.043","P. Pinang","PH","DAP",72.32,14.51,69.32,15.63],
  ["P.044","P. Pinang","PN","Bersatu",6.03,73.12,19.46,6.60],
  ["P.045","P. Pinang","PH","DAP",62.20,21.16,67.38,10.87],
  ["P.046","P. Pinang","PH","DAP",58.69,22.82,54.05,22.27],
  ["P.047","P. Pinang","PH","PKR",20.54,46.75,34.72,17.86],
  ["P.048","P. Pinang","PH","DAP",68.19,15.07,71.12,12.04],
  ["P.049","P. Pinang","PH","DAP",76.30,6.28,81.75,11.24],
  ["P.050","P. Pinang","PH","PKR",54.60,21.02,63.20,14.88],
  ["P.051","P. Pinang","PH","DAP",73.32,14.64,71.69,12.83],
  ["P.052","P. Pinang","PH","DAP",38.91,38.77,47.85,12.18],
  ["P.053","P. Pinang","PH","PKR",2.48,65.23,29.05,4.83],
  ["P.054","Perak","PN","Bersatu",3.98,66.84,13.51,3.03],
  ["P.055","Perak","BN","UMNO",3.18,83.21,11.80,1.38],
  ["P.056","Perak","PN","Bersatu",22.36,89.94,3.92,5.62],
  ["P.057","Perak","PN","Bersatu",10.20,68.43,25.88,5.10],
  ["P.058","Perak","PN","PAS",29.67,78.25,12.36,9.01],
  ["P.059","Perak","PN","Bersatu",17.82,71.25,19.14,9.04],
  ["P.060","Perak","PH","DAP",30.12,39.67,44.38,14.45],
  ["P.061","Perak","PN","Bersatu",10.19,77.87,14.82,6.75],
  ["P.062","Perak","PH","DAP",3.57,34.20,34.67,21.13],
  ["P.063","Perak","PH","PKR",2.98,64.63,20.49,12.48],
  ["P.064","Perak","PH","DAP",55.01,23.08,68.41,7.49],
  ["P.065","Perak","PH","DAP",72.32,13.15,59.11,26.96],
  ["P.066","Perak","PH","DAP",71.82,12.65,69.09,17.59],
  ["P.067","Perak","PN","Bersatu",9.97,70.35,21.02,6.57],
  ["P.068","Perak","PH","PKR",47.07,27.13,56.81,15.17],
  ["P.069","Perak","PN","PAS",5.74,92.34,2.00,2.52],
  ["P.070","Perak","PH","DAP",24.13,34.58,52.64,10.12],
  ["P.071","Perak","PH","DAP",26.20,42.69,44.76,9.63],
  ["P.072","Perak","BN","UMNO",11.38,45.53,24.48,13.90],
  ["P.073","Perak","PN","Bersatu",8.77,80.97,12.21,3.26],
  ["P.074","Perak","PN","Bersatu",0.51,72.20,14.13,11.36],
  ["P.075","Perak","BN","UMNO",0.83,56.44,20.44,21.60],
  ["P.076","Perak","PH","PKR",23.63,41.88,38.36,18.69],
  ["P.077","Perak","PH","Amanah",5.08,54.96,23.65,13.00],
  ["P.078","Pahang","BN","UMNO",13.66,30.97,27.15,12.19],
  ["P.079","Pahang","BN","UMNO",17.06,78.23,14.76,4.99],
  ["P.080","Pahang","PH","DAP",7.75,52.06,36.59,6.19],
  ["P.081","Pahang","PN","PAS",12.12,82.20,11.77,2.45],
  ["P.082","Pahang","PN","Bersatu",9.00,67.34,25.48,5.58],
  ["P.083","Pahang","PN","Bersatu",4.23,69.03,26.30,3.22],
  ["P.084","Pahang","BN","UMNO",2.12,83.96,11.06,1.92],
  ["P.085","Pahang","BN","UMNO",9.62,84.96,1.79,0.70],
  ["P.086","Pahang","PN","Bersatu",4.43,89.36,5.80,1.38],
  ["P.087","Pahang","PN","PAS",2.14,88.70,2.52,2.07],
  ["P.088","Pahang","PN","Bersatu",6.68,66.28,21.05,8.12],
  ["P.089","Pahang","PH","PKR",1.04,49.25,37.99,9.09],
  ["P.090","Pahang","BN","UMNO",28.04,62.04,27.82,3.66],
  ["P.091","Pahang","PN","PAS",2.15,83.29,2.43,0.89],
  ["P.092","Selangor","PN","Bersatu",12.34,81.32,13.05,4.88],
  ["P.093","Selangor","PN","Bersatu",5.33,67.33,29.33,2.10],
  ["P.094","Selangor","PN","Bersatu",1.28,62.81,18.14,15.13],
  ["P.095","Selangor","PN","Bersatu",4.26,73.15,17.20,8.23],
  ["P.096","Selangor","PH","PKR",1.16,66.81,12.06,19.55],
  ["P.097","Selangor","PH","PKR",16.30,51.59,26.30,17.90],
  ["P.098","Selangor","PH","Amanah",7.69,69.94,10.86,10.86],
  ["P.099","Selangor","PH","PKR",28.42,51.40,32.44,9.68],
  ["P.100","Selangor","PH","PKR",41.76,40.22,46.97,7.95],
  ["P.101","Selangor","PH","PKR",10.88,63.45,20.97,10.72],
  ["P.102","Selangor","PH","PKR",28.53,48.43,36.96,11.19],
  ["P.103","Selangor","PH","DAP",47.92,37.26,49.40,10.95],
  ["P.104","Selangor","PH","DAP",64.65,26.25,54.04,16.81],
  ["P.105","Selangor","PH","PKR",34.67,46.15,29.56,20.73],
  ["P.106","Selangor","PH","DAP",71.24,20.66,66.14,9.98],
  ["P.107","Selangor","PH","PKR",2.08,62.62,20.70,10.44],
  ["P.108","Selangor","PH","Amanah",13.33,73.36,12.67,11.92],
  ["P.109","Selangor","PN","Bersatu",7.46,68.00,15.26,14.21],
  ["P.110","Selangor","PH","DAP",56.01,26.65,52.77,18.25],
  ["P.111","Selangor","PH","PKR",37.42,39.81,29.68,27.34],
  ["P.112","Selangor","PN","Bersatu",1.48,54.86,23.76,17.28],
  ["P.113","Selangor","PH","PKR",6.49,62.92,19.15,13.14],
  ["P.114","WP KL","PH","DAP",84.46,5.62,85.51,7.08],
  ["P.115","WP KL","PH","PKR",25.52,44.05,34.57,18.18],
  ["P.116","WP KL","PH","PKR",22.32,57.71,28.51,9.11],
  ["P.117","WP KL","PH","DAP",69.81,26.77,56.76,11.81],
  ["P.118","WP KL","PH","Amanah",16.27,60.52,24.51,11.69],
  ["P.119","WP KL","BN","UMNO",7.61,66.43,16.50,9.31],
  ["P.120","WP KL","PH","DAP",73.63,13.05,71.60,12.41],
  ["P.121","WP KL","PH","PKR",18.13,59.09,19.14,17.18],
  ["P.122","WP KL","PH","DAP",76.83,12.06,76.78,8.96],
  ["P.123","WP KL","PH","DAP",75.89,13.44,77.09,7.77],
  ["P.124","WP KL","PH","PKR",10.55,61.99,26.94,8.77],
  ["P.125","WP Putrajaya","PN","Bersatu",6.30,93.85,0.89,2.78],
  ["P.126","N. Sembilan","BN","UMNO",17.92,65.12,23.33,5.49],
  ["P.127","N. Sembilan","BN","UMNO",8.16,63.63,22.01,12.74],
  ["P.128","N. Sembilan","PH","PKR",25.02,51.29,31.90,13.93],
  ["P.129","N. Sembilan","BN","UMNO",13.32,76.03,15.68,5.25],
  ["P.130","N. Sembilan","PH","DAP",51.79,32.57,42.64,22.38],
  ["P.131","N. Sembilan","BN","UMNO",18.18,73.49,8.86,15.94],
  ["P.132","N. Sembilan","PH","DAP",29.85,43.60,31.87,21.41],
  ["P.133","N. Sembilan","BN","UMNO",2.09,61.93,23.66,12.28],
  ["P.134","Melaka","PN","Bersatu",8.06,81.95,11.74,3.64],
  ["P.135","Melaka","PH","PKR",1.22,61.39,23.78,13.07],
  ["P.136","Melaka","PN","Bersatu",9.62,69.28,22.29,3.65],
  ["P.137","Melaka","PH","DAP",9.14,61.73,30.62,6.04],
  ["P.138","Melaka","PH","DAP",37.68,38.98,54.17,4.46],
  ["P.139","Melaka","PN","Bersatu",0.41,73.29,15.50,10.12],
  ["P.140","Johor","PH","DAP",11.19,46.70,42.64,9.32],
  ["P.141","Johor","PH","DAP",3.59,57.76,36.58,4.07],
  ["P.142","Johor","PH","DAP",8.15,37.55,43.75,15.36],
  ["P.143","Johor","PN","Bersatu",18.40,66.08,29.25,3.42],
  ["P.144","Johor","PH","PKR",12.16,55.29,38.55,4.89],
  ["P.145","Johor","PH","DAP",26.32,45.39,51.62,2.12],
  ["P.146","Johor","IND","IND",2.53,66.35,31.25,1.34],
  ["P.147","Johor","BN","UMNO",3.21,80.21,18.07,0.47],
  ["P.148","Johor","BN","UMNO",6.35,57.61,37.09,4.14],
  ["P.149","Johor","PH","PKR",6.53,63.69,33.83,1.37],
  ["P.150","Johor","PH","DAP",16.05,52.03,44.72,1.43],
  ["P.151","Johor","BN","UMNO",4.13,60.53,28.69,8.63],
  ["P.152","Johor","PH","PKR",27.62,41.23,46.06,10.43],
  ["P.153","Johor","BN","UMNO",26.58,60.25,27.81,8.80],
  ["P.154","Johor","PN","PAS",4.98,81.18,13.74,1.18],
  ["P.155","Johor","BN","MCA",5.82,72.99,16.36,7.04],
  ["P.156","Johor","BN","UMNO",17.73,88.67,7.96,1.78],
  ["P.157","Johor","BN","UMNO",11.97,89.38,8.06,0.75],
  ["P.158","Johor","PH","PKR",18.29,44.96,38.77,11.44],
  ["P.159","Johor","PH","Amanah",21.14,46.13,36.17,10.21],
  ["P.160","Johor","PH","DAP",16.99,51.42,39.23,5.90],
  ["P.161","Johor","PH","PKR",28.28,44.61,40.12,12.22],
  ["P.162","Johor","PH","DAP",36.68,36.27,47.22,14.10],
  ["P.163","Johor","PH","DAP",31.26,36.96,49.21,11.58],
  ["P.164","Johor","BN","UMNO",10.13,68.25,28.03,1.06],
  ["P.165","Johor","BN","MIC",11.65,57.02,40.05,1.02],
  ["P.167","Sabah","IND","IND",4.36,4.17,7.06,0.12],
  ["P.168","Sabah","IND","IND",16.37,2.66,2.01,0.08],
  ["P.169","Sabah","IND","IND",8.48,2.92,1.12,0.20],
  ["P.170","Sabah","PH","UPKO",0.40,4.76,4.24,0.23],
  ["P.171","Sabah","PH","PKR",10.02,12.97,17.07,0.54],
  ["P.172","Sabah","PH","DAP",53.91,4.21,59.90,0.98],
  ["P.173","Sabah","BN","UMNO",0.30,18.66,11.76,0.74],
  ["P.174","Sabah","PH","PKR",28.41,4.72,26.71,0.68],
  ["P.175","Sabah","GRS","PBS",28.10,8.92,6.29,0.30],
  ["P.176","Sabah","BN","UMNO",9.78,9.22,2.93,0.18],
  ["P.177","Sabah","BN","UMNO",8.59,7.21,5.44,0.32],
  ["P.178","Sabah","GRS","PBS",16.14,8.07,3.38,0.17],
  ["P.179","Sabah","GRS","GRS",26.22,2.20,1.32,0.08],
  ["P.180","Sabah","GRS","GRS",14.68,5.36,7.08,0.16],
  ["P.181","Sabah","IND","IND",3.87,6.09,8.50,0.08],
  ["P.182","Sabah","BN","UMNO",14.58,1.51,0.94,0.05],
  ["P.183","Sabah","PN","Bersatu",5.43,5.47,0.86,0.11],
  ["P.184","Sabah","BN","UMNO",28.34,28.03,15.12,0.31],
  ["P.185","Sabah","GRS","GRS",17.83,14.83,26.98,0.31],
  ["P.186","Sabah","PH","DAP",35.68,14.39,42.37,0.64],
  ["P.187","Sabah","BN","UMNO",14.75,14.61,0.68,0.14],
  ["P.188","Sabah","IND","IND",7.53,26.42,9.14,0.42],
  ["P.189","Sabah","IND","IND",53.48,6.60,1.52,0.14],
  ["P.190","Sabah","GRS","GRS",7.50,33.96,29.52,0.38],
  ["P.191","Sabah","BN","UMNO",18.19,49.17,8.37,0.36],
  ["P.192","Sarawak","PH","PKR",17.46,5.14,17.08,0.18],
  ["P.193","Sarawak","GPS","PBB",74.66,78.03,7.92,0.09],
  ["P.194","Sarawak","GPS","PBB",59.81,69.37,13.41,0.59],
  ["P.195","Sarawak","PH","DAP",45.44,4.53,85.26,0.70],
  ["P.196","Sarawak","PH","DAP",9.71,14.56,61.57,0.68],
  ["P.197","Sarawak","GPS","PBB",53.43,55.76,13.26,0.24],
  ["P.198","Sarawak","GPS","SUPP",26.07,4.80,24.91,0.18],
  ["P.199","Sarawak","GPS","PRS",41.77,7.60,10.21,0.17],
  ["P.200","Sarawak","GPS","PBB",66.36,69.99,5.19,0.05],
  ["P.201","Sarawak","GPS","PBB",52.48,70.74,2.70,0.02],
  ["P.202","Sarawak","GPS","SUPP",12.65,10.31,16.81,0.06],
  ["P.203","Sarawak","GPS","PDP",0.52,1.73,7.95,0.05],
  ["P.204","Sarawak","GPS","PBB",42.31,43.65,6.37,0.03],
  ["P.205","Sarawak","PN","PAS",28.62,36.90,6.64,0.03],
  ["P.206","Sarawak","GPS","PBB",73.05,23.26,6.06,0.05],
  ["P.207","Sarawak","GPS","PBB",86.32,5.96,3.83,0.02],
  ["P.208","Sarawak","GPS","SUPP",10.14,4.56,60.65,0.03],
  ["P.209","Sarawak","IND","IND",5.95,0.48,4.98,0.02],
  ["P.210","Sarawak","GPS","PDP",1.31,1.74,11.53,0.02],
  ["P.211","Sarawak","PH","DAP",21.80,4.23,64.96,0.05],
  ["P.212","Sarawak","PH","DAP",11.77,10.40,62.03,0.12],
  ["P.213","Sarawak","GPS","PRS",56.47,3.29,9.89,0.05],
  ["P.214","Sarawak","GPS","PRS",17.31,1.01,3.78,0.02],
  ["P.215","Sarawak","GPS","PRS",56.38,2.37,8.71,0.04],
  ["P.216","Sarawak","GPS","PBB",32.06,0.98,1.81,0.03],
  ["P.217","Sarawak","GPS","PBB",31.49,9.81,25.24,0.10],
  ["P.218","Sarawak","GPS","PBB",34.63,18.39,22.84,0.17],
  ["P.219","Sarawak","PH","PKR",7.88,16.78,46.38,0.32],
  ["P.220","Sarawak","GPS","PBB",24.64,4.52,7.44,0.04],
  ["P.221","Sarawak","GPS","PBB",50.51,25.82,17.48,0.10],
  ["P.222","Sarawak","GPS","PBB",31.18,35.90,9.42,0.12],
];

const SWING_STATES = new Set([
  "Perlis","Kedah","Kelantan","Terengganu","P. Pinang","Perak",
  "Pahang","Selangor","WP KL","WP Putrajaya","N. Sembilan","Melaka","Johor"
]);

const PARTY_BASE = {
  PAS:43, Bersatu:31, DAP:40, PKR:31, Amanah:8, UPKO:1,
  UMNO:26, MCA:2, MIC:2, PBB:14, SUPP:3, PRS:4, PDP:2,
  PBS:3, GRS:3, Warisan:3, IND:5,
};

const COALITION_PARTIES = {
  PN:      ["PAS","Bersatu"],
  PH:      ["PKR","DAP","Amanah","UPKO"],
  BN:      ["UMNO","MCA","MIC"],
  GPS:     ["PBB","SUPP","PRS","PDP"],
  GRS:     ["PBS","GRS"],
  Warisan: ["Warisan"],
  IND:     ["IND"],
};

const CO_COLOR = { PN:"#ef4444", PH:"#3b82f6", BN:"#f59e0b", GPS:"#22c55e", GRS:"#14b8a6", Warisan:"#a855f7", IND:"#71717a" };
const PARTY_COLOR = {
  PAS:"#b91c1c", Bersatu:"#ef4444",
  PKR:"#1d4ed8", DAP:"#dc2626", Amanah:"#60a5fa", UPKO:"#93c5fd",
  UMNO:"#d97706", MCA:"#fbbf24", MIC:"#fde68a",
  PBB:"#15803d", SUPP:"#4ade80", PRS:"#86efac", PDP:"#bbf7d0",
  PBS:"#0f766e", GRS:"#2dd4bf", Warisan:"#9333ea", IND:"#6b7280",
};

const DUN = {"10":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":266,"PH":111,"BN":76,"ALONE":36,"GRS":29},"gainer":{"co":"PN","d":57},"loser":{"co":"BN","d":-36},"states":{"Perlis":{"t":15,"o":14,"f":0,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":2,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":10,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":11,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":8,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":13,"m":19,"g":false},"Melaka":{"t":28,"o":2,"f":4,"m":15,"g":false},"Johor":{"t":56,"o":3,"f":4,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":1,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":7},"15":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":297,"PH":102,"BN":57,"ALONE":36,"GRS":26},"gainer":{"co":"PN","d":88},"loser":{"co":"BN","d":-55},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":10,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":13,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":14,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":14,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":13,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":11,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":4,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":9},"20":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":324,"PH":95,"BN":41,"ALONE":33,"GRS":25},"gainer":{"co":"PN","d":115},"loser":{"co":"BN","d":-71},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":12,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":16,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":17,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":17,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":16,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":19,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":9,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":9},"25":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":353,"PH":88,"BN":27,"ALONE":29,"GRS":21},"gainer":{"co":"PN","d":144},"loser":{"co":"BN","d":-85},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":3,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":14,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":19,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":17,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":19,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":17,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":30,"m":29,"g":true},"Sabah":{"t":73,"o":1,"f":18,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":10},"30":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":387,"PH":80,"BN":16,"GRS":15,"ALONE":20},"gainer":{"co":"PN","d":178},"loser":{"co":"BN","d":-96},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":3,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":15,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":21,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":18,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":22,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":19,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":38,"m":29,"g":true},"Sabah":{"t":73,"o":1,"f":35,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":10}};

function snapDunSwing(v) {
  const steps = [10,15,20,25,30];
  return String(steps.reduce((a,b) => Math.abs(b-Math.abs(v)) < Math.abs(a-Math.abs(v)) ? b : a));
}

function computeResults(ms, cs, is) {
  const base = { PN:0, PH:0, BN:0, GPS:0, GRS:0, IND:0 };
  const toPN = [], fromPN = [];
  for (const [code, state, coalition, party, margin, mPct, cPct, iPct] of SEATS) {
    base[coalition] = (base[coalition]||0) + 1;
    if (!SWING_STATES.has(state)) continue;
    const net = (ms*mPct + cs*cPct + is*iPct) / 100;
    if (coalition !== "PN") { if (net > margin/2)  toPN.push({code,state,coalition,party}); }
    else                    { if (-net > margin/2) fromPN.push({code,state,coalition,party}); }
  }
  return { base, toPN, fromPN };
}

// ── Components ────────────────────────────────────────────────────────────────

function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-zinc-800 text-zinc-300 border border-zinc-700",
    success: "bg-emerald-950 text-emerald-400 border border-emerald-800",
    danger:  "bg-red-950 text-red-400 border border-red-800",
    warning: "bg-amber-950 text-amber-400 border border-amber-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

function RaceSlider({ label, value, onChange, color }) {
  const pct = ((value + 60) / 120) * 100;
  const isPos = value > 0, isNeg = value < 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="text-xs font-medium text-zinc-300">{label}</span>
        </div>
        <span className={`text-xs font-mono font-semibold tabular-nums ${isPos ? "text-emerald-400" : isNeg ? "text-red-400" : "text-zinc-500"}`}>
          {value > 0 ? `+${value}%` : `${value}%`}
        </span>
      </div>
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-700 z-0" />
        <input
          type="range" min={-60} max={60} step={1} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="relative z-10 w-full"
          style={{
            background: `linear-gradient(to right, hsl(240 3.7% 20%) 0%, ${color} ${pct}%, hsl(240 3.7% 20%) ${pct}%)`,
            accentColor: color,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
        <span>−60%</span><span>0</span><span>+60%</span>
      </div>
    </div>
  );
}

const GIFS = {
  fireworks: "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif",
  crowd:     "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
};

function BannerCard({ pn }) {
  const maj = pn >= 112, close = pn >= 102 && pn < 112;
  const gif = maj ? GIFS.fireworks : close ? GIFS.crowd : null;

  if (maj) return (
    <Card className="border-emerald-800 bg-gradient-to-r from-zinc-900 to-emerald-950 overflow-hidden animate-fade-up">
      <div className="flex items-center justify-between p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Majority achieved</span>
          </div>
          <div className="text-5xl font-bold text-emerald-400 tabular-nums">{pn}</div>
          <div className="text-sm text-zinc-400">{pn - 112} seats above the 112-seat threshold · 222 total</div>
        </div>
        {gif && <img src={gif} alt="" className="h-20 w-auto rounded-lg opacity-90 object-cover" />}
      </div>
    </Card>
  );

  if (close) return (
    <Card className="border-amber-800 bg-gradient-to-r from-zinc-900 to-amber-950 overflow-hidden animate-fade-up">
      <div className="flex items-center justify-between p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Within striking distance</span>
          </div>
          <div className="text-5xl font-bold text-amber-400 tabular-nums">{pn}</div>
          <div className="text-sm text-zinc-400">{112 - pn} seats needed for majority · 222 total</div>
        </div>
        {gif && <img src={gif} alt="" className="h-20 w-auto rounded-lg opacity-90 object-cover" />}
      </div>
    </Card>
  );

  return (
    <Card className="border-red-900 bg-gradient-to-r from-zinc-900 to-red-950 overflow-hidden animate-fade-up">
      <div className="p-5 space-y-1">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium text-red-400">Short of majority</span>
        </div>
        <div className="text-5xl font-bold text-red-400 tabular-nums">{pn}</div>
        <div className="text-sm text-zinc-400">{112 - pn} seats needed to form government · 222 total</div>
      </div>
    </Card>
  );
}

function SeatMeter({ pnTotal, pnGained }) {
  const held   = pnTotal - pnGained;
  const heldPct   = (held / 222) * 100;
  const gainedPct = (pnGained / 222) * 100;
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-200">PN Seat Projection</span>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" />Held</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-orange-400 inline-block" />Gained</span>
          <span className="flex items-center gap-1.5"><span className="w-px h-3 bg-white/60 inline-block" />Majority (112)</span>
        </div>
      </div>
      <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-red-500 rounded-l-full transition-all duration-300" style={{ width: `${heldPct}%` }} />
        <div className="absolute inset-y-0 bg-orange-400 transition-all duration-300" style={{ left: `${heldPct}%`, width: `${gainedPct}%` }} />
        <div className="absolute inset-y-0 w-0.5 bg-white/80 z-10" style={{ left: `${(112/222)*100}%` }} />
      </div>
      <div className="flex justify-between text-xs text-zinc-600 tabular-nums">
        <span>0</span><span>112</span><span>222</span>
      </div>
    </Card>
  );
}

function StatGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <Card key={i} className="p-4 space-y-1" style={{ borderTopWidth: 2, borderTopColor: s.color }}>
          <div className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</div>
          <div className="text-xs font-semibold text-zinc-300">{s.label}</div>
          <div className="text-xs text-zinc-500">{s.sub}</div>
        </Card>
      ))}
    </div>
  );
}

function CoalitionRow({ co, pre, cur }) {
  const d = cur - pre;
  return (
    <div className="flex items-center gap-2 py-2 border-b border-zinc-800 last:border-0">
      <div className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: CO_COLOR[co] || "#71717a" }} />
      <span className="text-xs font-medium text-zinc-300 w-12">{co}</span>
      <div className="flex-1 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${cur/222*100}%`, background: CO_COLOR[co] || "#71717a" }} />
      </div>
      <span className="text-xs tabular-nums text-zinc-200 w-6 text-right">{cur}</span>
      {d !== 0 && (
        <span className={`text-xs tabular-nums font-medium w-8 text-right ${d > 0 ? "text-emerald-400" : "text-red-400"}`}>
          {d > 0 ? `+${d}` : d}
        </span>
      )}
    </div>
  );
}

function OverviewTab({ coalitions, base, post, gainerCo, loserCo, chartData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-4">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Coalition Changes</div>
        {coalitions.map(co => {
          const pre = base[co]||0, cur = post[co]||0;
          if (!pre && !cur) return null;
          return <CoalitionRow key={co} co={co} pre={pre} cur={cur} />;
        })}
      </Card>
      <Card className="p-4">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">PN Seats by State</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 62, right: 8, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis type="number" tick={{ fill: "#52525b", fontSize: 9 }} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#71717a", fontSize: 9 }} width={58} />
            <Tooltip
              contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 11 }}
              formatter={(v, n) => [v, n === "held" ? "Held" : n === "gained" ? "Gained" : "Others"]}
            />
            <Bar dataKey="held"   stackId="a" fill="#ef4444" />
            <Bar dataKey="gained" stackId="a" fill="#fb923c" />
            <Bar dataKey="other"  stackId="a" fill="#3f3f46" radius={[0,3,3,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function PartiesTab({ partyPost }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(COALITION_PARTIES).map(([coName, parties]) => {
        const maxSeats = Math.max(...parties.map(p => partyPost[p]||0), 1);
        const total    = parties.reduce((s, p) => s + (partyPost[p]||0), 0);
        return (
          <Card key={coName} className="p-4 space-y-3" style={{ borderTopWidth: 2, borderTopColor: CO_COLOR[coName] || "#52525b" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200">{coName}</span>
              <Badge>{total} seats</Badge>
            </div>
            <div className="space-y-2">
              {parties.map(p => {
                const cur = partyPost[p]||0, base = PARTY_BASE[p]||0, d = cur - base;
                const pct = maxSeats > 0 ? Math.min(cur / maxSeats * 100, 100) : 0;
                return (
                  <div key={p} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: PARTY_COLOR[p] || "#71717a" }} />
                        <span className="text-zinc-400">{p}</span>
                      </div>
                      <div className="flex items-center gap-1.5 tabular-nums">
                        <span className="text-zinc-200 font-medium">{cur}</span>
                        {d !== 0 && (
                          <span className={`text-xs ${d > 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {d > 0 ? `+${d}` : d}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: PARTY_COLOR[p] || "#71717a" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function DunTab({ dunSwing, dn }) {
  const dunStates = Object.entries(dn.states).map(([st, v]) => ({
    name: st.replace("P. Pinang","P.Pinang").replace("N. Sembilan","N.Semb"),
    orig: v.o, flip: v.f, total: v.t, maj: v.m, fg: v.g, gps: !!v.gps,
  })).sort((a, b) => a.gps - b.gps || (b.orig + b.flip) / b.total - (a.orig + a.flip) / a.total);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
        <span className="text-xs text-zinc-400">DUN model follows Malay slider · snapped to nearest step (10/15/20/25/30%)</span>
        <Badge variant="danger">Malay {dunSwing}%</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 border-t-2 border-t-emerald-700">
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">{dn.gainer.co} +{dn.gainer.d}</div>
          <div className="text-xs text-zinc-400 mt-1">DUN Gainer</div>
        </Card>
        <Card className="p-4 border-t-2 border-t-red-700">
          <div className="text-2xl font-bold text-red-400 tabular-nums">{dn.loser.co} {dn.loser.d}</div>
          <div className="text-xs text-zinc-400 mt-1">DUN Loser</div>
        </Card>
      </div>
      <div className="space-y-2">
        {dunStates.map(d => {
          if (d.gps) return (
            <Card key={d.name} className="p-3 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">{d.name}</span>
              <Badge variant="success">GPS · 82 seats · outside swing model</Badge>
            </Card>
          );
          const pnN = d.orig + d.flip;
          return (
            <Card key={d.name} className={`p-3 space-y-2 ${d.fg ? "border-emerald-900" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">{d.name}</span>
                <span className={`text-xs font-semibold tabular-nums ${d.fg ? "text-emerald-400" : "text-red-400"}`}>
                  {d.fg ? "✓" : "✗"} PN {pnN}/{d.total}
                </span>
              </div>
              <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-red-500 rounded-l-full" style={{ width: `${(d.orig/d.total)*100}%` }} />
                <div className="absolute inset-y-0 bg-orange-400" style={{ left: `${(d.orig/d.total)*100}%`, width: `${(d.flip/d.total)*100}%` }} />
                <div className="absolute inset-y-0 w-0.5 bg-white/70 z-10" style={{ left: `${(d.maj/d.total)*100}%` }} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function CoalitionBuilder({ partySeats }) {
  const [checked, setChecked] = useState(new Set(["PAS","Bersatu"]));
  const toggle = p => setChecked(prev => { const n = new Set(prev); n.has(p) ? n.delete(p) : n.add(p); return n; });
  const total  = [...checked].reduce((s, p) => s + (partySeats[p]||0), 0);
  const hasMaj = total >= 112;
  const fillW  = Math.min((total / 222) * 100, 100);

  return (
    <Card className="p-5 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-200">Coalition Builder</div>
          <div className="text-xs text-zinc-500 mt-0.5">Select parties to simulate a government</div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold tabular-nums ${hasMaj ? "text-emerald-400" : "text-red-400"}`}>{total}</div>
          <div className={`text-xs font-medium ${hasMaj ? "text-emerald-500" : "text-zinc-500"}`}>
            {hasMaj ? "Majority" : `${112 - total} seats short`}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
            style={{ width: `${fillW}%`, background: hasMaj ? "#22c55e" : "#3b82f6" }}
          />
          <div className="absolute inset-y-0 w-0.5 bg-white/70 z-10" style={{ left: `${(112/222)*100}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-600 tabular-nums">
          <span>0</span><span>112</span><span>222</span>
        </div>
      </div>

      <SeparatorPrimitive.Root className="h-px bg-zinc-800" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(COALITION_PARTIES).map(([coName, parties]) => (
          <div key={coName} className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: CO_COLOR[coName] || "#71717a" }}>
              {coName}
            </div>
            {parties.map(p => (
              <label key={p} className="flex items-center gap-2 cursor-pointer group">
                <CheckboxPrimitive.Root
                  checked={checked.has(p)}
                  onCheckedChange={() => toggle(p)}
                  className="w-4 h-4 rounded border border-zinc-600 bg-zinc-800 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  <CheckboxPrimitive.Indicator>
                    <CheckIcon className="w-3 h-3 text-white" />
                  </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: PARTY_COLOR[p] || "#71717a" }} />
                <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">{p}</span>
                <span className="text-xs tabular-nums text-zinc-500 ml-auto">{partySeats[p]||0}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [ms, setMs] = useState(15);
  const [cs, setCs] = useState(0);
  const [is, setIs] = useState(0);

  const { base, toPN, fromPN } = useMemo(() => computeResults(ms, cs, is), [ms, cs, is]);

  const toPNSet   = new Set(toPN.map(f => f.code));
  const fromPNSet = new Set(fromPN.map(f => f.code));

  // States where PAS is the dominant PN component (gains attributed to PAS)
  const PAS_STATES = new Set(["Kelantan","Terengganu","Kedah","Perlis"]);

  const post     = { ...base };
  const partyPost = { ...PARTY_BASE };
  for (const { coalition, party, state } of toPN) {
    post[coalition]--; post.PN = (post.PN||0) + 1;
    if (partyPost[party] !== undefined) partyPost[party]--;
    // Attribute gain to PAS in its heartland states, Bersatu elsewhere
    partyPost[PAS_STATES.has(state) ? "PAS" : "Bersatu"]++;
  }
  for (const { party } of fromPN) {
    post.PN--; post.PH = (post.PH||0) + 1;
    if (partyPost[party] !== undefined) partyPost[party]--;
    partyPost["PKR"]++;
  }

  const pnTotal  = post.PN||0;
  const pnGained = toPN.length;
  const pnLost   = fromPN.length;
  const hasMaj   = pnTotal >= 112;

  const coalitions = ["PN","PH","BN","GPS","GRS","IND"];
  let gainerCo = "PN", gainerD = 0, loserCo = "PH", loserD = 0;
  for (const co of coalitions) {
    const d = (post[co]||0) - (base[co]||0);
    if (d > gainerD) { gainerD = d; gainerCo = co; }
    if (d < loserD)  { loserD = d;  loserCo  = co; }
  }

  const stateMap = {};
  for (const [code, state, coalition] of SEATS) {
    if (!SWING_STATES.has(state)) continue;
    if (!stateMap[state]) stateMap[state] = { held:0, gained:0, other:0 };
    if (coalition === "PN" && !fromPNSet.has(code)) stateMap[state].held++;
    else if (toPNSet.has(code)) stateMap[state].gained++;
    else stateMap[state].other++;
  }
  const chartData = Object.entries(stateMap)
    .map(([st, v]) => ({
      name: st.replace("WP KL","KL").replace("WP Putrajaya","Putrajaya")
               .replace("N. Sembilan","N.Semb").replace("P. Pinang","P.Pinang"),
      held: v.held, gained: v.gained, other: v.other,
    }))
    .filter(d => d.held + d.gained > 0)
    .sort((a, b) => (b.held + b.gained) - (a.held + a.gained));

  const dunSwing = snapDunSwing(ms);
  const dn = DUN[dunSwing];

  const stats = [
    { value: pnTotal,               label: "PN Seats",  sub: hasMaj ? `+${pnTotal-112} above majority` : `${112-pnTotal} seats short`, color: hasMaj ? "#22c55e" : "#ef4444" },
    { value: `+${pnGained}`,        label: "Seats Gained", sub: "flipped to PN",    color: "#f59e0b" },
    { value: pnLost > 0 ? `-${pnLost}` : "0", label: "Seats Lost", sub: "lost from PN", color: pnLost > 0 ? "#ef4444" : "#52525b" },
    { value: loserD,                label: loserCo,    sub: "biggest loser",        color: "#ef4444" },
  ];

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">

      {/* Navbar */}
      <header className="flex-shrink-0 h-12 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-3 z-50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <span className="text-sm font-semibold text-zinc-100">Malaysia GE-15</span>
          <span className="text-zinc-600 text-sm">·</span>
          <span className="text-sm text-zinc-400">Swing Simulator</span>
        </div>
        <div className="flex-1" />
        <Badge>GE-15 Baseline · 222 Seats</Badge>
        <button
          onClick={() => { setMs(0); setCs(0); setIs(0); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-60 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
          <div className="p-4 space-y-5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                Vote swing to PN
              </div>
              <div className="space-y-5">
                <RaceSlider label="Malay"   value={ms} onChange={setMs} color="#ef4444" />
                <RaceSlider label="Chinese" value={cs} onChange={setCs} color="#3b82f6" />
                <RaceSlider label="Indian"  value={is} onChange={setIs} color="#22c55e" />
              </div>
              <p className="text-[10px] text-zinc-600 leading-relaxed mt-3">
                Positive → toward PN · Negative → away<br />
                Race-weighted per constituency · ±60%
              </p>
            </div>

            <SeparatorPrimitive.Root className="h-px bg-zinc-800" />

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                Live result
              </div>
              <div className="space-y-0.5">
                {coalitions.map(co => {
                  const pre = base[co]||0, cur = post[co]||0;
                  if (!pre && !cur) return null;
                  return <CoalitionRow key={co} co={co} pre={pre} cur={cur} />;
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-4 max-w-5xl">

            <BannerCard pn={pnTotal} />
            <SeatMeter pnTotal={pnTotal} pnGained={pnGained} />
            <StatGrid stats={stats} />

            <TabsPrimitive.Root defaultValue="overview">
              <TabsPrimitive.List className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
                {[
                  { k: "overview", l: "Overview" },
                  { k: "parties",  l: "Parties" },
                  { k: "dun",      l: "State DUN" },
                  { k: "builder",  l: "Coalition Builder" },
                ].map(t => (
                  <TabsPrimitive.Trigger
                    key={t.k}
                    value={t.k}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-500 data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100 hover:text-zinc-300 transition-colors"
                  >
                    {t.l}
                  </TabsPrimitive.Trigger>
                ))}
              </TabsPrimitive.List>

              <div className="mt-4">
                <TabsPrimitive.Content value="overview">
                  <OverviewTab coalitions={coalitions} base={base} post={post} gainerCo={gainerCo} loserCo={loserCo} chartData={chartData} />
                </TabsPrimitive.Content>
                <TabsPrimitive.Content value="parties">
                  <PartiesTab partyPost={partyPost} />
                </TabsPrimitive.Content>
                <TabsPrimitive.Content value="dun">
                  <DunTab dunSwing={dunSwing} dn={dn} />
                </TabsPrimitive.Content>
                <TabsPrimitive.Content value="builder">
                  <CoalitionBuilder partySeats={partyPost} />
                </TabsPrimitive.Content>
              </div>
            </TabsPrimitive.Root>

          </div>

          <footer className="px-5 py-4 border-t border-zinc-800 flex justify-between text-[10px] text-zinc-600">
            <span>TindakMalaysia GE-15 voter roll (Oct 2022) · MECo CC0 · Race-weighted constituency model · Hypothetical scenarios</span>
            <span>GE-15 · 19 Nov 2022</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
