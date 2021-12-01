FROM node:14 as build

WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./.eslintrc.js ./.prettierrc ./nest-cli.json ./ormconfig.js ./tsconfig.build.json ./tsconfig.json ./
COPY ./scripts ./scripts
COPY ./src ./src

RUN yarn build

FROM node:14
ENV NODE_ENV=production
WORKDIR /usr/local/app
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/dist ./
CMD ["node", "./src/main.js"]
