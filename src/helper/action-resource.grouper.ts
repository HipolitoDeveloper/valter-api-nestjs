import { Resources } from '../common/permission/permission.type';

type ActionResources = {
  action: string;
  resource: string;
}[];

export const actionResourceGrouper = (
  actionResources: ActionResources,
): Resources => {
  const groupedActions: Resources = {};

  actionResources.forEach(({ action, resource }) => {
    if (!groupedActions[resource]) {
      groupedActions[resource] = {};
    }

    if (groupedActions[resource]) {
      groupedActions[resource] = {
        ...groupedActions[resource],
        [action]: true,
      };
    }
  });

  return groupedActions;
};
