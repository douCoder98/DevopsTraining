.PHONY: build run stop clean

IMAGE_NAME = image-gen
CONTAINER_NAME = image-gen-container
PORT = 3000

build:
	docker build . -t $(IMAGE_NAME)

run:
	docker run -d -p $(PORT):$(PORT) --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

clean: stop
	docker rmi $(IMAGE_NAME)