angular.module('cloudinaryModule', [
    'cloudinary',
    'gimmi.config'
])
.provider('cloudinaryService', ['CONFIG', function(CONFIG){
    var _self = this;
    /** Set default options for Cloudinary upload widget.
     * All options can be found at: https://cloudinary.com/documentation/upload_widget#cloudinary_openuploadwidget_options_resultcallback
     */
    var widgetOptions = {
        sources: ['local', 'image_search', 'url'],
        resourceType: 'image',
        multiple: false,
        theme: "minimal",
        showPoweredBy: false, //Note: Supported only for paid Cloudinary accounts and requires some time for cache expiration.
        showAdvancedOptions: false,
        showCompletedButton: false
    };
    
    _self.setOption = function (key, value){
        widgetOptions[key] = value;
        return _self;
    }
    _self.$get = ['$http', '$q', 'CONFIG', function($http, $q, CONFIG){
        var clsrv = {};
        
        /** Get a signature for a signed upload to Cloudinary */
        clsrv.getSignature = function (callback, params_to_sign) {
            $http.post(CONFIG.apiUrl + '/api/images/signature', params_to_sign)
                .then(function(results) {
                    var signature = results.data;
                    callback(signature);
                });
        }

        /** 
         * Create a cloudinary upload widget 
         * @function createWidget
         * @param {String} publicId A dynamically chosen publicId
         * @param {function} callback A callback function with arguments error and results to handle events in the upload widget
         * @return {CloudinaryUploadWidget}
         * */
        clsrv.createWidget = function(publicId, callback) {
            if (publicId) {
                widgetOptions.publicId = publicId;
            }
            widgetOptions.uploadSignature = clsrv.getSignature;
            return cloudinary.createUploadWidget(widgetOptions, callback);
        }

        /**
         * Upload a cloudinary image
         * @function uploadImage
         * @param {String} publicId The wanted publicId of the image (best practice: equal to wish ID)
         * @param {String} image A url or image string
         * @param {function} callback A callback function with arguments error and results to handle events.
         * @return {Image} Return an image if the upload succeeded
         * @return {Error} Return an image if the upload failed
         */
        clsrv.uploadImage = function(publicId, image, callback) {
            var body = {
                public_id: publicId,
                image: image
            }
            $http.post(CONFIG.apiUrl + '/api/images', body).then( function(image) {
                if (callback) {
                    callback(null, image);
                }
            },
            function(error){
                callback(error);
            });
        }

        /**
         * Rename a cloudinary image
         * @function renameImage
         * @param {String} publicId The current publicId of the image
         * @param {String} newName The new name of the image. No foldername included in this id!! Only new image ID.
         * @param {function} callback A callback function with arguments error and results to handle events.
         * @return {Image}
         */
        clsrv.renameImage = function(publicId, newName) {
            var deferred = $q.defer();
            var body = {
                new_public_id: newName
            }
            $http.put(CONFIG.apiUrl + '/api/images/' + encodeURIComponent(publicId) + '/public_id', body)
                .then(function(results){
                    var image = {
                        public_id: results.data.public_id,
                        version: results.data.version
                    }
                    deferred.resolve(image);
                });
            return deferred.promise;
        }

        /**
         * Delete a cloudinary image
         * @function deleteImage
         * @param {String} publicId The current publicId of the image
         */
        clsrv.deleteImage = function(publicId, callback) {
            $http.delete(CONFIG.apiUrl + '/api/images/' + encodeURIComponent(publicId))
                .then(function(){
                    callback();
                });
        }

        /** 
         * Generate a cloudinary URL based on public_id
         * @param {String} public_id
         * @param {String} version
         */
        clsrv.generateCloudinaryUrl = function(public_id, version) {
            return "https://res.cloudinary.com/" + CONFIG.cloudinary.cloudName + "/image/upload/v" + version + "/" + public_id
        }

        /**
         * Generate a random public id
         * @param {String} prefix A string to attach before the random number
         * @param {String} postfix A string to attach after the random number
         */
        clsrv.generateRandomPublicID = function (prefix, postfix){
            var randomNumber = Math.floor((Math.random() * 1000000) + 1);
            return `${prefix}-${randomNumber}${postfix}`
        }

        return clsrv;
    }];
}]);