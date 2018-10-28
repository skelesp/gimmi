angular.module('cloudinaryModule')
    .directive('clUpload', ['cloudinaryService', function (cloudinaryService){
    return {
        restrict: 'AE',
        replace: false,
        scope: {
            searchTerm: '@',
            publicId: '@',
            imageResult: '=',
            onImageUpload: '&',
            onCancel: '&'
        },        
        link: function ($scope, $element, $attrs) {
            /** Create the upload widget on loading the directive */
            var widget = cloudinaryService.createWidget($scope.publicId, function (error, result) {
                if (result && result.event === "success") {
                    var uploadedImage = {
                        public_id: result.info.public_id,
                        version: result.info.version
                    };
                    console.log("Uploaded image: ", uploadedImage);
                    if ($scope.imageResult) {
                        $scope.$apply(function() {
                            $scope.imageResult = uploadedImage;
                        });
                    }
                    if ($scope.onImageUpload) {
                        $scope.$apply($scope.onImageUpload(uploadedImage));
                    }
                    widget.close();
                } else if (error) {
                    console.error(error);
                    if ($scope.onCancel) {
                        $scope.$apply($scope.onCancel(error));
                    }
                }
            });

            /** On click on element: open the widget */
            $element.on('click', function () {
                widget.open();
            });
        }
    }
}])