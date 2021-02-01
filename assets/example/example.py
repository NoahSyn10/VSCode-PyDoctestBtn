#A simple example file containing two functionins and proper doctests
#Author: Noah S.

import math

def pothagoreanTheorem(a, b):
    """
    >>> pothagoreanTheorem(3, 4)
    5.0
    """
    return math.sqrt(a**2 + b**2)

def reverseDict(aDict):
    """
    />>> a = {"Apples" : "Tree", "Carrots" : "Ground", "Oranges" : "Tree"}
    />>> reverseDict(a)
    {'Tree': ['Apples', 'Oranges'], 'Ground': ['Carrots']}
    """
    reversedDict = {}
    for key in aDict:
        if aDict[key] not in reversedDict:
            reversedDict[aDict[key]] = [key]
        else:
            reversedDict[aDict[key]].append(key)
    return reversedDict