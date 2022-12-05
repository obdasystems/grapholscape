import { rubbishBin, subHierarchies, superHierarchies } from "../assets";
import { Command } from "../common/context-menu";

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

export function remove(callback: () => void): Command {
  return {
    content: 'Remove',
    icon: rubbishBin,
    select: callback,
  }
}