/**
 * Serenity UI v2017.1.170722 (https://www.serenityui.com)
 */
(function ($, serenity) {
    serenity.Model = serenity.Observable.extend({
        /// <class>serenity.Model</class>
        /// <inherits url="serenity.Observable.html">serenity.Observable</inherits>
        /// <typedef>export class Model</typedef>
        /// <summary>Model tracks changes to data and raises an event when data is changed.</summary>
        /// <version added="2016.1" updated="2017.1" />

        /// <summary>Values passed into the constructor when initialized.</summary>
        /// <datatype>JSON Object</datatype>
        /// <default>null</default>
        /// <version added="2016.1" updated="2016.1" />
        _pristine: null,

        /// <property>dirty</property>
        /// <datatype>Boolean</datatype>
        /// <typedef>dirty: boolean</typedef>
        /// <summary>Flag indicating whether data has changed.</summary>
        /// <version added="2016.1" updated="2016.1" />
        dirty: null,

        /// <property>UUID</property>
        /// <datatype>String</datatype>
        /// <summary>Universal unique identifier used to uniquely identify the instance of the model.</summary>
        /// <version added="2016.1" updated="2016.1" />
        UUID: null,

        /// <inheritedFrom>serenity.Observable</inheritedFrom>
        /// <datatype>Array</datatype>
        /// <typedef>events: string[]</typedef>
        /// <summary>Array of events.</summary>
        /// <version added="2016.1" updated="2016.1" />
        events: [
            /// <event>change</event>
            /// <summary>Fired when a change occurs in the data.</summary>
            /// <param name="e.model" type="serenity.Model">Model that triggered the change event.</param>
            /// <param name="e.attribute" type="String">The attribute that changed.</param>
            /// <param name="e.value" type="Object">The value assigned to the attribute.</param>
            /// <param name="e.before" type="Object">The value of the attribute before the new value was assigned.</param>
            /// <example for="JavaScript">
            /// var Person = serenity.Model.extend({
            ///   firstName: null,
            ///   lastName: null
            /// });
            /// var person = new Person({ firstName: "John", lastName: "Doe" });
            /// person.bind("change", function (e) {
            ///   console.log(e);
            /// });
            /// person.set("lastName", "Smith");
            /// </example>
            /// <version added="2016.1" updated="2016.1" />
            "change"
        ],

        options: {
            // <option>id</option>
            /// <datatype>String</datatype>
            /// <summary>Attribute that contains a unique value for the instance of the model.</summary>
            /// <version added="2016.1" updated="2016.1" />
            id: null
        },

        constructor: function (values, options) {
            /// <function>constructor</function>
            /// <typedef>constructor()</typedef>
            /// <typedef>constructor(values: any)</typedef>
            /// <typedef>constructor(values: any, options: any)</typedef>
            /// <summary>Constructor for the model.</summary>
            /// <version added="2016.1" updated="2016.1" />

            serenity.Observable.call(this, options);

            this.dirty = false;
            this.UUID = serenity.guid();

            // Initialize the model with the values passed in.
            if (arguments.length > 0) {
                this._pristine = values;

                this._initProperties(values);
            }
        },

        set: function (property, value) {
            /// <function>set</function>
            /// <typedef>set(property: string, value: any)</typedef>
            /// <summary>Set the value of a property in the model.</summary>
            /// <example for="JavaScript">
            /// var Person = serenity.Model.extend({
            ///   firstName: null,
            ///   lastName: null
            /// });
            /// var person = new Person();
            /// person.set("firstName", "John");
            /// person.set("lastName", "Doe");
            /// </example>
            /// <version added="2016.1" updated="2016.1" />

            var different = this[property] != value;
            if (different) {
                var before = typeof this[property] !== "undefined" ? this._cloneProperty(property) : undefined;
                this._setProperty(property, value);
                this.dirty = true;
                this.trigger("change", { model: this, property: property, value: this[property], before: before });
            }
            return different;
        },

        toJSON: function () {
            /// <function>toJSON</function>
            /// <typedef>toJSON()</typedef>
            /// <summary>Convert the model to a JSON object.</summary>
            /// <example for="JavaScript">
            /// var Person = serenity.Model.extend({
            ///   firstName: null,
            ///   lastName: null
            /// });
            /// var person = new Person({ firstName: "John", lastName: "Doe" });
            /// console.log(person.toJSON());
            /// </example>
            /// <version added="2016.1" updated="2016.1" />

            var json = {};
            var modelAttributes = ",";

            for (var key in serenity.Model.prototype) {
                modelAttributes += key + ",";
            }

            for (var key in this) {
                if (modelAttributes.indexOf("," + key + ",") === -1) {
                    json[key] = this[key];
                }
            }
            return json;
        },
        
        rollback: function () {
            /// <function>rollback</function>
            /// <typedef>rollback()</typedef>
            /// <summary>Rollback the values in the model to the values that were set when the model was instantiated.</summary>
            /// <example for="JavaScript">
            /// var Person = serenity.Model.extend({
            ///   firstName: null,
            ///   lastName: null
            /// });
            /// var person = new Person({ firstName: "John", lastName: "Doe" });
            /// person.set("lastName", "Smith");
            /// console.log(person.toJSON());
            /// person.rollback();
            /// console.log(person.toJSON());
            /// </example>
            /// <version added="2017.1" updated="2017.1" />
            
            try {
                if (typeof this._pristine === "object") {
                    for (var key in this._pristine) {
                        this[key] = this._pristine[key];
                    }
                    this.dirty = false;
                }
            } catch (err) {
            }
            
            return this;
        },

        commit: function () {
            /// <function>commit</function>
            /// <typedef>commit()</typedef>
            /// <summary>Commit the values in the model to the values that have been set since the model was instantiated.</summary>
            /// <example for="JavaScript">
            /// var Person = serenity.Model.extend({
            ///   firstName: null,
            ///   lastName: null
            /// });
            /// var person = new Person({ firstName: "John", lastName: "Doe" });
            /// person.set("lastName", "Smith");
            /// console.log(person.toJSON());
            /// person.commit();
            /// console.log(person.toJSON());
            /// </example>
            /// <version added="2017.1" updated="2017.1" />
            
            try {
                if (typeof this._pristine === "object") {
                    for (var key in this._pristine) {
                        this._pristine[key] = this[key];
                    }
                    this.dirty = false;
                }
            } catch (err) {
            }
            
            return this;
        }
    });
})(window.jQuery, window.serenity);
