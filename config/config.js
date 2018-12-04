// Set debug level for tracer
const loglevel = process.env.LOGLEVEL || 'trace'

module.exports = {
    "webPort": process.env.PORT || 3000,


    // Tracer for logging purposes
    logger: require('tracer')
    .console({
        format: [
            "{{timestamp}} <{{title}}> {{file}}:{{line}} : {{message}}"
        ],
        preprocess: function (data) {
            data.title = data.title.toUpperCase();
        },
        dateformat: "isoUtcDateTime",
        level: loglevel
    })
}