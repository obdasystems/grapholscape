import { classIcon, classInstanceIcon, equivalentClasses, objectPropertyIcon, rubbishBin, subHierarchies, superHierarchies } from "../../../ui/assets";
import { Command } from "../../../ui/common/context-menu";

export function showHideSuperHierarchies(hide: boolean, callback: () => void): Command {
  return {
    content: `${hide ? `Hide` : `Show`} Super Hierarchies`,
    icon: superHierarchies,
    select: callback,
  }
}

export function showHideSuperClasses(hide: boolean, callback: () => void): Command {
  return {
    content: `${hide ? `Hide` : `Show`} Super Classes`,
    icon: superHierarchies,
    select: callback,
  }
}

export function showHideSubHierarchies(hide: boolean, callback: () => void): Command {
  return {
    content: `${hide ? `Hide` : `Show`} Sub Hierarchies`,
    icon: subHierarchies,
    select: callback,
  }
}

export function showHideSubClasses(hide: boolean, callback: () => void): Command {
  return {
    content: `${hide ? `Hide` : `Show`} Sub Classes`,
    icon: subHierarchies,
    select: callback,
  }
}

export function showHideEquivalentClasses(hide: boolean, callback: () => void): Command {
  return {
    content: `${hide ? `Hide` : `Show`} Equivalent Classes`,
    icon: equivalentClasses,
    select: callback
  }
}

export function remove(callback: () => void): Command {
  return {
    content: 'Remove',
    icon: rubbishBin,
    select: callback,
  }
}

export function showParentClass(callback: () => void): Command {
  return {
    content: 'Show Current Parent Classes',
    icon: classIcon,
    select: callback,
  }
}

export function performInstanceChecking(callback: () => void): Command {
  return {
    content: 'Compute and Show Parent Classes',
    icon: classIcon,
    select: callback,
  }
}

export function focusInstance(callback: () => void): Command {
  return {
    content: 'Show Relationships',
    icon: objectPropertyIcon,
    select: callback,
  }
}

export function getInstances(callback: () => void): Command {
  return {
    content: 'Show Some Instances',
    icon: classInstanceIcon,
    select: callback,
  }
}