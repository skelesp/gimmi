angular.module('cloudinaryUploadWidget', [
    'cloudinary',
    'gimmi.config'
])
    .provider('cloudinaryUpload', ['CONFIG', function(CONFIG){
    var _self = this;
    /** Set default options for Cloudinary upload widget.
     * All options can be found at: https://cloudinary.com/documentation/upload_widget#cloudinary_openuploadwidget_options_resultcallback
     */
    var widgetOptions = {
        sources: ['local', 'image_search', 'url'],
        defaultSource: 'image_search',
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
    _self.$get = ['$http', function($http){
        var clsrv = {};
        /** Get a signature for a signed upload to Cloudinary */
        clsrv.getSignature = function (callback, params_to_sign) {
            $http.post(CONFIG.apiUrl + '/api/images/signature', params_to_sign)
                .then((results) => {
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
            widgetOptions.publicId = publicId;
            widgetOptions.uploadSignature = clsrv.getSignature;
            return cloudinary.createUploadWidget(widgetOptions, callback);
        }
        return clsrv;
    }];
}]);