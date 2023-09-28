import {SetMetadata} from "@nestjs/common";
import {RoleEnum} from "src/common";
import {ROLES_KEY} from "../constants";

export const RoleDecorator = (...roles: RoleEnum[]) => {
    return SetMetadata(ROLES_KEY, roles)
}
