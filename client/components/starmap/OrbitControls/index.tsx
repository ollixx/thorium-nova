import React, {forwardRef, useRef, useEffect} from "react";
import {
  ReactThreeFiber,
  extend,
  useThree,
  useFrame,
  Overwrite,
} from "react-three-fiber";
import {OrbitControls as OrbitControlsImpl} from "./OrbitControlsImpl";
// @ts-ignore
import mergeRefs from "react-merge-refs";
import {Camera, Vector3} from "three";
import {useConfigStore} from "../configStore";

extend({OrbitControlsImpl});

export type OrbitControlsType = Overwrite<
  ReactThreeFiber.Object3DNode<OrbitControlsImpl, typeof OrbitControlsImpl>,
  {target?: Vector3}
>;

export const OrbitControls = forwardRef(
  (props: OrbitControlsType = {enableDamping: true}, ref) => {
    const controls = useRef<OrbitControlsImpl>();
    const {camera, gl, invalidate} = useThree();
    useFrame(() => controls.current?.update());
    useEffect(() => {
      const myControls = controls.current;
      myControls?.addEventListener("change", invalidate);
      return () => myControls?.removeEventListener("change", invalidate);
    }, [invalidate]);

    const systemId = useConfigStore(store => store.systemId);
    React.useEffect(() => {
      controls.current?.reset();
    }, [systemId]);

    const PAN_LIMIT = 8000;
    React.useEffect(() => {
      // Block the orbit controls from panning too far
      if (controls.current) {
        var minPan = new Vector3(-PAN_LIMIT, -PAN_LIMIT, -PAN_LIMIT);
        var maxPan = new Vector3(PAN_LIMIT, PAN_LIMIT, PAN_LIMIT);
        var _v = new Vector3();
        function lockPan() {
          if (controls.current?.target) {
            const target = controls.current.target as Vector3;
            _v.copy(target);
            target.clamp(minPan, maxPan);
            _v.sub(target);
            camera.position.sub(_v);
          }
        }
        const myControls = controls.current;
        myControls.addEventListener?.("change", lockPan);
        return () => myControls?.removeEventListener("change", lockPan);
      }
    }, [PAN_LIMIT, camera.position]);
    const args: [camera: Camera, canvas?: HTMLCanvasElement] = [
      camera,
      gl.domElement,
    ];
    return (
      <orbitControlsImpl
        ref={mergeRefs([controls, ref])}
        // @ts-expect-error
        args={args}
        enableDamping
        {...props}
      />
    );
  }
);
