FROM iojs:onbuild

# File Author / Maintainer
MAINTAINER Kalentine Vamenek

ENV DIR /src/
ENV PATH /usr/local/bin:$PATH

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p ${DIR} && cp -a /tmp/node_modules ${DIR}

WORKDIR ${DIR}
COPY . ${DIR}

EXPOSE 3330

CMD ["node", "main.js"]