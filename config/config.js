// Set debug level for tracer
const loglevel = process.env.LOGLEVEL || 'trace'

module.exports = {

    // Web port where the server will listen to
    "webPort": process.env.PORT || 3000,

    // MongoDB URL van AZURE
    "mongoURL": "mongodb+srv://nodeAPI:5jurs7rjZarm@scoutactivityrepo-db-iupae.azure.mongodb.net/test?retryWrites=true",

    // Secret key for JWT encoding and decoding
    "key": "fyh8z4rbiGAY7CkVRid6V5JYmAVs",

    // JWT token duration
    "jwtDuration": "30d",


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