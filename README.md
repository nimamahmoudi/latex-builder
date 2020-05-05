# latex-builder

 A simple UI that can be used to build latex files and convert them using pandoc.

## Getting Started

To run the server, you can use the following command:

```sh
docker run -d -p 80:3000 --name latex-builder --restart always nimamahmoudi/latex-builder
```

In case you want to put the server behind a reverse proxy:

```sh
docker run -it -p 127.0.0.1:3000:3000 nimamahmoudi/latex-builder
```

Or to update the image and run it again, or as something done as a cronjob:

```sh
docker rm -f latex-builder && docker pull nimamahmoudi/latex-builder && docker run -d -p 80:3000 --name latex-builder --restart always nimamahmoudi/latex-builder
```

Or use `docker-compose` along with caddy with automatic tls:

```sh
sudo apt-get update && sudo apt install -qy python-pip && pip install docker-compose
# or as root
# apt-get update && apt install -qy python-pip && pip install docker-compose

docker-compose up -d
```

## References

- [CSS Tricks: drag and drop file uploading](https://css-tricks.com/drag-and-drop-file-uploading/)
- [Stackoverflow: executing shell in nodejs](https://stackabuse.com/executing-shell-commands-with-node-js/)
- [Fireshipio: Responsive Nav CSS](https://github.com/fireship-io/222-responsive-icon-nav-css)
- [CSS Tricks: old timey terminal styling](https://css-tricks.com/old-timey-terminal-styling/)
- [Blog Post: The hidden power of handlebars partials](https://cloudfour.com/thinks/the-hidden-power-of-handlebars-partials/)
