FROM node:20.18.0 AS build
WORKDIR /chatbotapp

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

FROM nginx:alpine

COPY --from=build /chatbotapp/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

