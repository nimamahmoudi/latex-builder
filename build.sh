echo "Shell process starting..."

build_docx()
{
    FOLDER=$1
    FILE_PATH=$2
    BIB_FILE=$3
    CSL_FILE_NAME=$4
    CSL_URL="https://raw.githubusercontent.com/nimamahmoudi/latex-styles/master/"$CSL_FILE_NAME
    curl -sSL $CSL_URL > $FOLDER/$CSL_FILE_NAME
    printf "\n\nBuilding the latex file: $FOLDER/$FILE_PATH for docx\n"

    if [ -f "$FOLDER/${BIB_FILE}.bib" ]; then
        echo "${BIB_FILE}.bib exists, compiling with bib file..."
        bash -c "cd $FOLDER && pandoc $FILE_PATH.tex -f latex --bibliography=${BIB_FILE}.bib --csl=$CSL_FILE_NAME -t docx -o ${FILE_PATH}.docx" && \
            mkdir -p ../output && \
            mv ${FOLDER}/${FILE_PATH}.docx ../output/${FILE_PATH}.docx
    else
        echo "${BIB_FILE}.bib doesn't exist, compiling without bib file..."
        bash -c "cd $FOLDER && pandoc $FILE_PATH.tex -f latex --csl=$CSL_FILE_NAME -t docx -o ${FILE_PATH}.docx" && \
            mkdir -p ../output && \
            mv ${FOLDER}/${FILE_PATH}.docx ../output/${FILE_PATH}.docx
    fi

    
    printf "Building $FOLDER/${FILE_PATH}.docx finished.\n\n"
}

cd $2 || exit
rm -r content 2>/dev/null
rm -r output 2>/dev/null
unzip -qq upload.zip -d content || exit

cd content || exit
printf "\n\ncontent structure:\n"
tree

# build docx
build_docx . main bibliography ieee.csl || exit

cd ../output
echo "================================================"
printf "output structure:\n"
tree

printf "\n\n"
