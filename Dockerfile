# syntax=docker/dockerfile:1
FROM public.ecr.aws/amazonlinux/amazonlinux:2023 as build
WORKDIR /usr/src
RUN yum install -y tar gzip
ADD https://nodejs.org/dist/v18.16.1/node-v18.16.1-linux-x64.tar.gz .
RUN tar zxf node-v18.16.1-linux-x64.tar.gz

FROM public.ecr.aws/amazonlinux/amazonlinux:2023
COPY --from=build /usr/src/node-v18.16.1-linux-x64 /usr/local/node
WORKDIR /usr/app
ENV PATH /usr/local/node/bin:$PATH
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "node", "src/index.js" ]
