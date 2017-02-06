import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from "meteor/check";
import { FAQs, FAQCategories } from "../../both/collections/faqs.collection";
import { FAQ, FAQCategory } from "../../both/models/faq.model";
import { isValidFirstName, isValidSlug } from "../../both/validators";

interface Options {
    [key: string]: any;
}

Meteor.methods({
    /* FAQs */
    "faqs.insert": (formData: FAQ) => {
        try {
            validateFAQData(formData);
        } catch (err) {
            let errMesg = err.reason || `Invalid formData supplied.`;
            throw new Meteor.Error(403, errMesg);
        }
        
        let insertedID = FAQs.collection.insert(formData);

        return insertedID;
    },
    "faqs.update": (quesId:string, formData: FAQ) => {
        try {
            validateFAQData(formData);
        } catch (err) {
            let errMesg = err.reason || `Invalid formData supplied.`;
            throw new Meteor.Error(403, errMesg);
        }
        
        return FAQs.collection.update({_id: quesId}, {$set: formData});
    },
    "faqs.find": (options: Options, criteria: any, searchString: string) => {
        let where: any = [];
        where.push({
            "$or": [{ deleted: false }, { deleted: { $exists: false } }]
        });

        if (typeof searchString === 'string' && searchString.length) {
            where.push({
                "$or": [
                    { "question": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "answer": { $regex: `.*${searchString}.*`, $options: 'i' } },
                ]
            });
        }

        let cursor = FAQs.collection.find({ $and: where }, options);
        return { count: cursor.count(), data: cursor.fetch() };
    },
    "faqs.findOne": (quesId: string) => {
        return FAQs.collection.findOne({ _id: quesId });
    },
    "faqs.delete": (faqId: string) => {
        return FAQs.collection.update({_id: faqId}, {$set: {
            deleted: true
        } });
    },
    "faqs.activate": (faqId: string) => {
        return FAQs.collection.update({_id: faqId}, {$set: {
            active: true
        } });
    },
    "faqs.deactivate": (faqId: string) => {
        return FAQs.collection.update({_id: faqId}, {$set: {
            active: false
        } });
    },

    /* FAQ Categories */ 
    "faqcategories.insert": (faqcategoryData: FAQCategory) => {
        try {
            validateFAQCategoryData(faqcategoryData);
        } catch (err) {
            let errMesg = err.reason || `Invalid formData supplied.`;
            throw new Meteor.Error(403, errMesg);
        }
        
        let faqcategoryId = FAQCategories.collection.insert(faqcategoryData);

        return faqcategoryId;
    },
    "faqcategories.update": (faqcategoryId: string, faqcategoryData: FAQCategory) => {
        try {
            validateFAQCategoryData(faqcategoryData);
        } catch (err) {
            let errMesg = err.reason || `Invalid formData supplied.`;
            throw new Meteor.Error(403, errMesg);
        }
        return FAQCategories.collection.update({ _id: faqcategoryId }, { $set: faqcategoryData });
    },
    "faqcategories.find": (options: Options, criteria: any, searchString: string) => {
        let where: any = [];
        where.push({
            "$or": [{ deleted: false }, { deleted: { $exists: false } }]
        });

        if (typeof searchString === 'string' && searchString.length) {
            where.push({
                "$or": [
                    { "title": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "summary": { $regex: `.*${searchString}.*`, $options: 'i' } },
                ]
            });
        }

        let cursor = FAQCategories.collection.find({ $and: where }, options);
        return { count: cursor.count(), data: cursor.fetch() };
    },
    "faqcategories.findOne": (faqcategoryId: string) => {
        return FAQCategories.collection.findOne({ _id: faqcategoryId });
    },
    "faqcategories.delete": (faqcategoryId: string) => {
        return FAQCategories.collection.update({_id: faqcategoryId}, {$set: {
            deleted: true
        } });
    },
    "faqcategories.activate": (faqcategoryId: string) => {
        return FAQCategories.collection.update({_id: faqcategoryId}, {$set: {
            active: true
        } });
    },
    "faqcategories.deactivate": (faqcategoryId: string) => {
        return FAQCategories.collection.update({_id: faqcategoryId}, {$set: {
            active: false
        } });
    }
});

function validateFAQData(item: FAQ) {
    /* validate question */
    let quesLen = item.question.length;
    if (quesLen < 5 || quesLen > 255) {
        throw new Meteor.Error(403, `Invalid question supplied.`);
    }

    /* validate summary */
    /*let answerLen = item.answer.length;
    if (answerLen < 8 || answerLen > 255) {
        throw new Meteor.Error(403, `Invalid answer supplied.`);
    }*/

    return true;
}

function validateFAQCategoryData(item: FAQCategory) {
    /* validate title */
    let titleLen = item.title.length;
    if (titleLen < 5 || titleLen > 255) {
        throw new Meteor.Error(403, `Invalid title supplied.`);
    }

    /* validate summary */
    let summaryLen = item.summary.length;
    if (summaryLen < 8 || summaryLen > 255) {
        throw new Meteor.Error(403, `Invalid summary supplied.`);
    }

    return true;
}