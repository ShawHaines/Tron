#!/bin/bash
for eachfile in `ls *.mtl`
do
	# name=${eachfile%.mtl}
	# touch summary.txt
	ori="Ks 0.500000 0.500000 0.500000"
	new="Ks 0.05 0.05 0.05"
	cat ${eachfile} | sed "s/${ori}/${new}/g" > ${eachfile}_tmp
	mv ${eachfile}_tmp ${eachfile}
done
