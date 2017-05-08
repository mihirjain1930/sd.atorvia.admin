import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import { Thumb, Image } from "../models/image.model";

export const Images = new MongoObservable.Collection<Image>('images');

function loggedIn(userId) {
  return !!userId;
}
export const ImagesStore = new UploadFS.store.Local({
  collection: Images.collection,
  name: 'images',
  path: process.env.PWD + '/../supplier/uploads/images',
  filter: new UploadFS.Filter({
    contentTypes: ['image/*']
  }),
  /*copyTo: [
    ThumbsStore
  ],*/
  permissions: new UploadFS.StorePermissions({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
  })
});
