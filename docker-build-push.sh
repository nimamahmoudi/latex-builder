REPO=$(cat dockername)/latex-builder
echo "Docker Repo: $REPO"
docker build . -t $REPO
docker push $REPO