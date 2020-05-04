echo "Shell process starting..."
cd $2
rm -r content 2>/dev/null
unzip -qq upload.zip -d content
cd content

printf "\n\ncontent structure:\n"
tree

printf "\n\n"
