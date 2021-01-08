#!/bin/bash
for eachfile in `ls *.obj`
do
	name=${eachfile%.obj}
	touch summary.txt
	echo "{" >>summary.txt
	echo -e "\tname: '${name}'," >>summary.txt
	echo -e "\tobj: './resource/NaturePack/${name}.obj'," >>summary.txt
	echo -e "\tmtl: './resource/NaturePack/${name}.mtl'," >>summary.txt
	echo "}," >>summary.txt
done
