FROM golang:1 AS sqlite-builder
WORKDIR /sqlite
RUN git clone https://gitlab.com/cznic/sqlite.git .
RUN CGO_ENABLED=0 go build -o /usr/local/bin/sqlite3 ./examples/example1

FROM node:lts
WORKDIR /app
COPY . .
#RUN npm install 
RUN npm ci --omit=dev

COPY --from=sqlite-builder /usr/local/bin/sqlite3 /usr/local/bin/sqlite3

# OpenShift stuff
RUN chgrp -R 0 /app && chmod -R g=u /app

USER 1001
EXPOSE 3000

CMD [ "node", "src/index.js" ]
