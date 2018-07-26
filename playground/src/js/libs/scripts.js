var scripts = function () {
	//var unpack = unpack unpack in javascript must be called with apply to the function
	var _G = window

	var OPERATOR_FUNCTIONS = {
		"+" : function(a, b){return a + b },
		"-" : function(a, b) {return a - b},
		"/" : function(a, b) {return a / b},
		"*" : function(a, b) {return a * b},
		"%" : function(a, b) {return a % b},
		"and" : function(a, b) {return a && b},
		"or" : function(a, b) {return a || b},
		"not" : function(a) {return !a},
		">" : function(a, b) {return a > b},
		"<" : function(a, b) {return a < b},
		"==" : function(a, b) {return a === b},
		"<=" : function(a, b) {return a <= b},
		">=" : function(a, b) {return a >= b},
		"~=" : function(a, b) {return a !== b},
		"++" : function(a) {return a + 1},
		"--" : function(a) {return a - 1},
		"^" : function(a, b) {return Math.pow(a, b)},
		".." : function(a, b) {return String(a) + String(b)},
		"#" : function(a) {return a.length}
}

	function executeInstruction(instruction, variables) {
		if (instruction.id === "set") {
			if (instruction.index) {
				var isTable = typeof variables[instruction.name] === "object"
				variables[instruction.name] = isTable ? variables[instruction.name] : {}
				if (instruction.value)
					variables[instruction.name][instruction.index] = instruction.value
				else if (instruction.copyFrom)
					variables[instruction.name][instruction.index] = variables[instruction.copyFrom] || _G[instruction.copyFrom] || 0
			}
			else if (instruction.value)
				variables[instruction.name] = instruction.value
			else if (instruction.instructions)
				variables[instruction.name] = instruction.instructions
		}
		else if (instruction.id === "get") {
			if (instruction.variable) {
				if (instruction.index) {
					var variable = variables[instruction.variable] || _G[instruction.variable] || 0
					variables[instruction.name] = variable[instruction.index]
				}
				else
					variables[instruction.name] = variables[instruction.variable] || _G[instruction.variable] || 0
			}
		}
		else if (instruction.id === "operation") {
			var value1 = variables[instruction.variable1] || instruction.value1 || 0
			var value2 = variables[instruction.variable2] || instruction.value2 || 0
			var storeReturnID = instruction.storeReturn || "lastReturn"

			variables[storeReturnID] = OPERATOR_FUNCTIONS[instruction.operation](value1, value2)
		}
		else if (instruction.id === "execute") {
			var iterations = Number(instruction.iterations) || (variables[instruction.iterations] || 1)
			for (var index = 0; index < iterations; index++) {
				var storeReturnID = instruction.storeReturn || "lastReturn"
				var params = []
				if (instruction.useSelf)
					params[0] = _G[instruction.variable] || variables[instruction.variable] || 0
				if (instruction.parameters) {
					for (var indexParam = 0; indexParam < instruction.parameters.length; indexParam++) {
						var sumParam = instruction.useSelf ? 1 : 0
						params[indexParam + sumParam] = variables[instruction.parameters[indexParam]]
					}
				}

				if (_G[instruction.variable]) {
					if (instruction.index)
						variables[storeReturnID] = _G[instruction.variable][instruction.index].apply(null, params)
					else
						variables[storeReturnID] = _G[instruction.variable].apply(null, params)
				}
				else {
					if ("function" === typeof variables[instruction.variable])
						variables[storeReturnID] = variables[instruction.variable].apply(null, params)
					else if (instruction.index) {
						if ("function" === typeof variables[instruction.variable][instruction.index])
							variables[storeReturnID] = variables[instruction.variable][instruction.index].apply(null, params)
						else
							variables[storeReturnID] = scripts.run(variables[instruction.variable][instruction.index], variables)
					}
					else
						variables[storeReturnID] = scripts.run(variables[instruction.variable], variables)
				}
			}
		}
		else if (instruction.id === "compare") {
			if (variables[instruction.variable])
				if (variables[instruction.executeOnTrue]) {
					if ("function" === typeof variables[instruction.executeOnTrue])
						variables[instruction.executeOnTrue]()
					else
						scripts.run(variables[instruction.executeOnTrue], variables, variables)
				}
				else if (variables[instruction.executeOnFalse]) {
					if ("function" === typeof variables[instruction.executeOnFalse])
						variables[instruction.executeOnFalse]()
					else
						scripts.run(variables[instruction.executeOnFalse], variables, variables)
				}
		}
	}

	return{
		run:function (script, presetVariables) {
			var variables = presetVariables || {}

			for (var index = 0; index < script.length; index++) {
				var instruction = script[index]
				var result = executeInstruction(instruction, variables)

				//if (!result)
				//	return index
			}
		}
	}
}()
