/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module upload/imageuploadbutton
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageUploadEngine from '@ckeditor/ckeditor5-upload/src/imageuploadengine';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import { isImageType, findOptimalInsertionPosition } from '@ckeditor/ckeditor5-upload/src/utils';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';

/**
 * Image upload button plugin.
 * Adds `insertImage` button to UI component factory.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageUploadButton extends Plugin {
	/**
	 * @inheritDoc
	 */
    static get requires() {
        return [ImageUploadEngine];
    }

	/**
	 * @inheritDoc
	 */
    init() {
        const editor = this.editor;
        const t = editor.t;

        // Setup `insertImage` button.
        editor.ui.componentFactory.add('insertImage3', locale => {
            const view = new FileDialogButtonView(locale);
            const command = editor.commands.get('imageUpload');

            view.set({
                acceptedType: 'image/*',
                allowMultipleFiles: true
            });

            view.buttonView.set({
                label: t('Resim yükle'),
                icon: imageIcon,
                tooltip: true
            });

            view.bind('isEnabled').to(command);

            view.on('done', (evt, files) => {
                for (const file of Array.from(files)) {
                    const insertAt = findOptimalInsertionPosition(editor.document.selection);

                    if (isImageType(file)) {
                        var reader  = new FileReader();
                        reader.addEventListener("load", function () {
                            editor.document.enqueueChanges(() => {
                                const imageElement = new ModelElement('image', {
                                    src: reader.result
                                });
                                editor.data.insertContent(imageElement, editor.document.selection);
                            });

                          }, false);
                        
                          if (file) {
                            reader.readAsDataURL(file);
                          }
                    }
                }
            });

            return view;
        });

        console.log('InsertImage was initialized');
    }


}
