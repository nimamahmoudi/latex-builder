echo "Shell process starting..."

cd $2 2>/dev/null || exit
rm -r content 2>/dev/null
rm -r output 2>/dev/null
unzip -qq upload.zip -d content || exit

cd content || exit
printf "\n\ncontent structure:\n"
tree

# build rst
pandoc README.md -t rst -o README.rst && mkdir -p ../output && mv README.rst ../output/

cd ../output || exit
echo "================================================"
printf "output structure:\n"
tree

cd ../
rm -r content

printf "\n\n"
