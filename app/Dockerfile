FROM lukechannings/deno:v1.26.2

EXPOSE 7777

WORKDIR /app

COPY . .

RUN deno cache app-launch.js

CMD [ "run", "--unstable", "--watch", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--no-check", "app-launch.js" ]
