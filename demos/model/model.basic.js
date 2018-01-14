$(function () {
    // Define a Person model.
    var Person = serenity.Model.extend({
        id: null,
        firstName: null,
        lastName: null,
        birthDate: null,
        fullName: {
            get: function () {
                /// <summary>Get the person's full name.</summary>
                return serenity.format("{0} {1}", this.firstName, this.lastName);
            },
            set: function (value) {
                /// <summary>Set the person's full name.</summary>
                var names = value.split(' ');
                this.firstName = names[0];
                this.lastName = names[1];
            }
        },
        age: {
            get: function () {
                /// <summary>Get the person's age.</summary>
                return moment().diff(moment(this.birthDate), "years");
            }
        }
    });
    // Define an Employee model that extends the Person model.
    var Employee = Person.extend({
        title: null,
        service: null
    });
    // Create an instance of an Employee model.
    var employee = new Employee({
        id: 1,
        fullName: "Anthony Nelson",
        title: "Junior Quality Assurance Engineer",
        service: 4,
        birthDate: new Date("11/30/1973")
    });
    function printResults() {
        var results = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            results[_i] = arguments[_i];
        }
        for (var idx = 0; idx < results.length; idx++) {
            $("#results").append(serenity.format("<div>{0}</div>", results[idx]));
        }
    }
    printResults("<b>The toJSON function creates a JSON object from the model.</b>");
    printResults("JSON.stringify(employee.toJSON())", serenity.format("{0}", JSON.stringify(employee.toJSON())), " ");
    printResults("<b>The firstName and lastName properties were populated by the Person.fullName.set function.</b>");
    printResults(serenity.format("employee.firstName: {0}", employee.firstName), " ", serenity.format("employee.lastName: {0}", employee.lastName), " ");
    printResults("<b>The Person.fullName.get function works the same as a property getter in C# by using <a target='_blank' href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty'>Object.defineProperty</a>.</b>");
    printResults(serenity.format("employee.fullName: {0}", employee.fullName), " ");
    printResults("<b>The Person.age.get function also works the same as a property getter in C# by using <a target='_blank' href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty'>Object.defineProperty</a>.</b>");
    printResults(serenity.format("employee.age: {0}", employee.age));
});
//# sourceMappingURL=model.basic.js.map