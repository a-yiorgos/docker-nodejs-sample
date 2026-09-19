FROM node:lts
WORKDIR /app
COPY . .
#RUN npm install 
RUN npm ci --omit=dev

# OpenShift stuff
RUN chgrp -R 0 /app && chmod -R g=u /app

USER 1001
EXPOSE 3000

CMD [ "node", "src/index.js" ]
