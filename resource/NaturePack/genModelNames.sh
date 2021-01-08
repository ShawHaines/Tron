#!/bin/bash
for eachfile in `ls *.obj`
do
	name=${eachfile%.obj}
	touch summary_model_names.txt
	echo -e "\"${name}\", " >>summary_model_names.txt
done
