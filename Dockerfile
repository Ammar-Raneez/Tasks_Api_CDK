FROM public.ecr.aws/docker/library/node:lts-alpine as base

ARG ECR_ENVIRONMENT
ENV ECR_ENVIRONMENT=${ECR_ENVIRONMENT}

RUN echo "Running build command for $ECR_ENVIRONMENT"

WORKDIR /app

FROM base AS dependencies

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts

FROM dependencies AS build

COPY . .
RUN if [ "$ECR_ENVIRONMENT" = "dev" ]; then \
      yarn build:dev; \
    else \
      echo "Unknown environment: $ECR_ENVIRONMENT" && \
      yarn build:dev; \
    fi

FROM public.ecr.aws/docker/library/node:lts-alpine as release

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY --from=build /app/dist ./

EXPOSE 3001

CMD ["node", "main.js"]
