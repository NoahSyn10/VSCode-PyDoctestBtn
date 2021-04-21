# A simple example function containing proper doctests
# Author: Noah S.

import math

def pythagoreanTheorem(a, b):
    """
    Uses the pythagorean a^2 + b^2 = c^2 on inputs 'a' and 'b'

    >>> pythagoreanTheorem(3, 4)
    5.0
    >>> pythagoreanTheorem(6.0, 8.0)
    10.0
    >>> pythagoreanTheorem(12.45, 16.32)
    20.5267
    >>> pythagoreanTheorem("Foo", 9) is None
    True
    """
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        return None
    return round(math.sqrt(a**2 + b**2), 4)

def failure():
    """
    >>> a = None
    >>> a
    >>> a = None
    """
    