export const adminRoles=["pastor","secretary","media","treasurer","member"] as const;

export type AdminRole=(typeof adminRoles)[number];

const routePermissions:Record<Exclude<AdminRole,"pastor"|"member">,string[]>={
  secretary:[
    "/admin/eventos",
    "/admin/devocionales",
    "/admin/peticiones",
    "/admin/nuevos-creyentes",
    "/admin/estudio-juan"
  ],
  media:[
    "/admin/predicaciones",
    "/admin/devocionales",
    "/admin/eventos",
    "/admin/fotos",
    "/admin/misiones"
  ],
  treasurer:["/admin/donaciones"]
};

export function isAdminRole(value:unknown):value is AdminRole{
  return typeof value==="string"&&adminRoles.includes(value as AdminRole);
}

export function canAccessAdminPath(role:unknown,pathname:string){
  if(role==="pastor")return true;
  if(role!=="secretary"&&role!=="media"&&role!=="treasurer")return false;
  if(pathname==="/admin")return true;
  return routePermissions[role].some(route=>pathname===route||pathname.startsWith(route+"/"));
}

export function defaultAdminPathForRole(role:unknown){
  if(role==="pastor")return "/admin";
  if(role==="secretary")return "/admin/eventos";
  if(role==="media")return "/admin/fotos";
  if(role==="treasurer")return "/admin/donaciones";
  return "/";
}
