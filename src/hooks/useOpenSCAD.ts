import { useState, useCallback, useRef, useEffect } from 'react';
import { WorkerMessage, WorkerMessageType } from '@/worker/types';
import OpenSCADError from '@/lib/OpenSCADError';
import WorkspaceFile from '@/lib/WorkspaceFile';

export function useOpenSCAD() {
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<OpenSCADError | Error | undefined>();
  const [isError, setIsError] = useState(false);
  const [output, setOutput] = useState<Blob | undefined>();
  const workerRef = useRef<Worker | null>(null);
  // Track files written to the worker filesystem
  const writtenFilesRef = useRef<Set<string>>(new Set());

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../worker/worker.ts', import.meta.url),
        { type: 'module' },
      );
    }
    return workerRef.current;
  }, []);

  const eventHandler = useCallback((event: MessageEvent) => {
    // Only handle preview/export responses, not fs operations
    if (
      event.data.type === WorkerMessageType.PREVIEW ||
      event.data.type === WorkerMessageType.EXPORT
    ) {
      if (event.data.err) {
        setError(event.data.err);
        setIsError(true);
        setOutput(undefined);
      } else if (event.data.data?.output) {
        const blob = new Blob([event.data.data.output], {
          type:
            event.data.data.fileType === 'stl' ? 'model/stl' : 'image/svg+xml',
        });
        setOutput(blob);
      }
      setIsCompiling(false);
    }
  }, []);

  useEffect(() => {
    const worker = getWorker();
    worker.addEventListener('message', eventHandler);

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
      writtenFilesRef.current.clear();
    };
  }, [eventHandler, getWorker]);

  // Write a file to the OpenSCAD worker filesystem
  const writeFile = useCallback(
    async (path: string, content: Blob | File): Promise<void> => {
      const worker = getWorker();

      // Convert Blob to WorkspaceFile if needed
      const arrayBuffer = await content.arrayBuffer();
      const workspaceFile = new WorkspaceFile([arrayBuffer], path, {
        path,
        type: content.type,
      });

      const message: WorkerMessage = {
        type: WorkerMessageType.FS_WRITE,
        data: {
          path,
          content: workspaceFile,
        },
      };

      worker.postMessage(message);
      writtenFilesRef.current.add(path);
    },
    [getWorker],
  );

  // Remove a file from the worker filesystem
  const unlinkFile = useCallback(
    (path: string): void => {
      const worker = getWorker();

      const message: WorkerMessage = {
        type: WorkerMessageType.FS_UNLINK,
        data: { path },
      };

      worker.postMessage(message);
      writtenFilesRef.current.delete(path);
    },
    [getWorker],
  );

  // Check if a file has been written to the worker
  const hasFile = useCallback((path: string): boolean => {
    return writtenFilesRef.current.has(path);
  }, []);

  const compileScad = useCallback(
    async (code: string) => {
      setIsCompiling(true);
      setError(undefined);
      setIsError(false);

      const worker = getWorker();
      worker.addEventListener('message', eventHandler);

      const message: WorkerMessage = {
        type: WorkerMessageType.PREVIEW,
        data: {
          code,
          params: [],
          fileType: 'stl',
        },
      };

      worker.postMessage(message);
    },
    [eventHandler, getWorker],
  );

  return {
    compileScad,
    writeFile,
    unlinkFile,
    hasFile,
    isCompiling,
    output,
    error,
    isError,
  };
}
