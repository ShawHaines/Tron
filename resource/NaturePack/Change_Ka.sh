#!/bin/bash
for eachfile in `ls *.mtl`
do
	# name=${eachfile%.mtl}
	# touch summary.txt
	ori="Ka 1.000000 1.000000 1.000000"
	new="Ka 0.0 0.0 0.0"
	cat ${eachfile} | sed "s/${ori}/${new}/g" > ${eachfile}_tmp
	mv ${eachfile}_tmp ${eachfile}
done
